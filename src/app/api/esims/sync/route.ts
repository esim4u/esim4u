import { ORDER_STATUS } from "@/enums";
import { supabase } from "@/services/supabase";
import axios from "axios";

export const maxDuration = 50;
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
    const orders = await supabase
        .from("orders")
        .select("*")
        .in("status", [ORDER_STATUS.SUCCESS, ORDER_STATUS.PENDING]);

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
                    })
                    .eq("id", esim.id);
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
                const updatedOrder = await supabase
                    .from("orders")
                    .update({
                        available_topups: availableTopups.data,
                    })
                    .eq("id", esim.id);
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

    return Response.json(orders, { status: 200 });
}
