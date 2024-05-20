import { createCheckout } from "@/services/sumup";
import { supabase } from "@/services/supabase";
import { ceil, floor } from "@/lib/utils";
import axios from "axios";
import { sendTgLog } from "@/services/tg-logger";

export async function POST(req: Request) {
    const {
        net_price,
        original_price,
        total_price,
        total_price_ton,
        total_price_eur,
        telegram_id,
        package_id,
        coverage,
        validity,
        data,
    } = await req.json();

    const order = await supabase
        .from("orders")
        .insert({
            telegram_id: telegram_id || 0,
            package_id: package_id,
            coverage: coverage,
            price: {
                net: net_price,
                original: original_price,
                total: total_price, //original price + 20% + ceil to whole number
                profit: total_price - net_price,
                total_price_eur: total_price_eur,
                total_price_ton: total_price_ton,
                // airalo_profit: floor(original_price * 0.85),
                // profit: ceil(total_price * 0.35), //35% of original price
                // delta: ceil(total_price - floor(original_price * 0.85)), //full profit
                currency: "USD",
            },
            description: `esim4u.t.me - ${package_id}`,
            type: "ESIM",
            validity: validity,
            data: data,
        })
        .select();

    if (order.error) {
        return Response.json(order.error);
    }

    const id = await createCheckout(
        `tg-esim-${order.data[0].id}`,
        total_price_eur,
        `esim4u.t.me - ${package_id}`,
        "EUR"
    );

    await sendTgLog(`Sumup id: ${id}`);

    const transaction = await supabase
        .from("transactions")
        .insert({
            telegram_id: telegram_id || 0,
            checkout_id: id,
            type: "ORDER"
        })
        .select();

    if (transaction.error) {
        console.error(transaction.error);
        return Response.json(transaction.error);
    }

    await supabase
        .from("orders")
        .update({ transaction_id: transaction.data[0].id, })
        .eq("id", order.data[0].id);

    return Response.json({
        order_id: order.data[0].id,
        transaction_id: transaction.data[0].id,
        sumup_id: id,
    });
}
