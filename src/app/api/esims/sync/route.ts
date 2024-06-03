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

    await axios
        .get(
            `https://api.telegram.org/bot7140478549:AAEH-4xJ8FWeUEN6x_xa4tsu5NvG8pnRgeI/sendMessage?chat_id=473700512&text=${encodeURI(
                "test"
            )}&parse_mode=html`
        )
        .catch((e) => {});

    return Response.json(orders);
}
