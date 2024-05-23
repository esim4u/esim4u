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
        .select()
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

    return Response.json(orders.data, { status: 200 });
}
