import { ceil } from "@/lib/utils";
import axios from "axios";
import dummy_data from "@/assets/data/dummy_country.json";
import { supabase } from "@/services/supabase";
import { ORDER_STATUS } from "@/enums";

export async function GET(
    request: Request,
    { params }: { params: { telegram_id: string } }
) {
    const telegram_id = params.telegram_id;

    if (!telegram_id) {
        return Response.json(
            {
                message: "Telegram ID is required",
            },
            { status: 403 }
        );
    }

    const user = await supabase
        .from("users")
        .select()
        .eq("telegram_id", telegram_id);

    if (user.error) {
        return Response.json(
            {
                message: "An error occurred while fetching user data",
            },
            { status: 500 }
        );
    }
    if (user.data.length == 0) {
        return Response.json(
            {
                message: "User not found",
            },
            { status: 404 }
        );
    }

    const orders = await supabase
        .from("orders")
        .select("id, iccid")
        .eq("telegram_id", telegram_id)
        .in("status", [ORDER_STATUS.SUCCESS, ORDER_STATUS.PENDING]);

    if (orders.error) {
        return Response.json(
            {
                message: "An error occurred while fetching orders",
                description: orders.error.message,
            },
            { status: 500 }
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
                    }
                )
                .then((res) => res.data.data)
                .catch((e) => e.response);

            if (usage && usage.status) {
                const updatedOrder = await supabase
                    .from("orders")
                    .update({
                        state: usage?.data?.status,
                        usage: {
                            remaining: usage.remaining,
                            total: usage.total,
                        },
                        expired_at: usage.expired_at,
                    })
                    .eq("id", esim.id);
            }
        }
    } catch (error) {}

    const currentOrders = await supabase
        .from("orders")
        .select()
        .eq("telegram_id", telegram_id)
        .in("status", [ORDER_STATUS.SUCCESS, ORDER_STATUS.PENDING]);

    return Response.json(currentOrders.data, { status: 200 });
}
