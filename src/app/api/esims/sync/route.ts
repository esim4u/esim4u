import axios from "axios";

import { ceil } from "@/lib/utils";
import supabase from "@/lib/supabase";
import { EXCHANGE_RATE, MARGIN_RATE } from "@/features/payment/constants";
import { ESIM_STATE, ORDER_STATUS } from "@/features/orders/enums";

export const maxDuration = 50;
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
    // select esims older than 1 hour
    const timestampzISOStr = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(); // 1 hour ago
    const orders = await supabase
        .from("orders")
        .select("*")
        .eq("type", "ESIM")
        .in("status", [ORDER_STATUS.SUCCESS, ORDER_STATUS.PENDING])
        .in("state", [ESIM_STATE.ACTIVE, ESIM_STATE.NOT_ACTIVE, ESIM_STATE.FINISHED])
        .or(`updated_at.lte.${timestampzISOStr},updated_at.is.null`) // select orders older than 1 hour or null(new orders)
        .order("id", { ascending: false })
        .limit(10)

    if (orders.error) {
        console.log("An cron error occurred while fetching orders");

        return Response.json(
            {
                message: "An error occurred while fetching orders",
                description: orders.error.message,
            },
            { status: 500 },
        );
    }

    const updatedOrders = [];
    try {
        for (const esim of orders.data) {
            const usage = await axios
                .get(
                    process.env.AIRALO_API_URL + `/v2/sims/${esim.iccid}/usage`,
                    {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${process.env.AIRALO_BUSINESS_ACCESS_TOKEN}`,
                        },
                    },
                )
                .then((res) => res.data)
                .catch((e) => e.response);

            if (usage && usage?.data?.status) {
                const updatedOrder = await supabase
                    .from("orders")
                    .update({
                        state: usage?.data?.status,
                        usage: {
                            remaining: usage.data?.remaining,
                            total: usage.data?.total,
                        },
                        expired_at: usage.data?.expired_at,
                        updated_at: new Date(),
                    })
                    .eq("id", esim.id)
            }

            const availableTopups = await axios
                .get(
                    process.env.AIRALO_API_URL +
                        `/v2/sims/${esim.iccid}/topups`,
                    {
                        headers: {
                            Accept: "application/json",
                            Authorization: `Bearer ${process.env.AIRALO_BUSINESS_ACCESS_TOKEN}`,
                        },
                    },
                )
                .then((res) => res.data)
                .catch((e) => e.response);

            if (availableTopups && availableTopups?.data?.length) {
                availableTopups.data.forEach((topup: any) => {
                    topup.total_price =
                        ceil(topup.price + topup.price * MARGIN_RATE, 0) - 0.01; //ceil to whole number
                    topup.total_price_eur = ceil(topup.total_price * EXCHANGE_RATE, 2);
                });

                const updatedOrder = await supabase
                    .from("orders")
                    .update({
                        available_topups: availableTopups.data,
                    })
                    .eq("id", esim.id)
                    .select("*")

                updatedOrders.push(updatedOrder);
            }
        }
    } catch (error) {
        console.log("An error occurred while updating orders", error);

        return Response.json(
            {
                message: "An error occurred while updating orders",
                description: error,
            },
            { status: 500 },
        );
    }

    return Response.json(updatedOrders, { status: 200 });
}
