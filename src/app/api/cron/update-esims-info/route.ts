import { ORDER_STATUS } from "@/enums";
import { supabase } from "@/services/supabase";
import { sendTgLog } from "@/services/tg-logger";
import axios from "axios";

export async function GET() {
    const orders = await supabase
        .from("orders")
        .select("*")
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

    await sendTgLog("cron stated processing esims orders: " + orders.data.map((o) => o.id).join(", "));

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
                .then((res) => res.data)
                .catch((e) => e.response);

            console.log(usage);
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

                console.log(updatedOrder);
            }
        }
    } catch (error) {}

    await sendTgLog("cron finished processing esims orders: " + orders.data.map((o) => o.id).join(", "));


    return Response.json({
        message: "update-esims-info cron finished successfully",
    });
}
