import { ORDER_STATUS } from "@/enums";
import { supabase } from "@/services/supabase";
import { sendTgLog } from "@/services/tg-logger";

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
            { status: 500 }
        );
    }

    console.log(
        "cron stated processing esims orders: " +
            orders.data.map((o) => o.id).join(", ")
    );

    sendTgLog(
        "cron stated processing esims orders: " +
            orders.data.map((o) => o.id).join(", ")
    );

    return Response.json(orders);
}
