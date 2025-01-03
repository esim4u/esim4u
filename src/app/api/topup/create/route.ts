import { createCheckout } from "@/features/payment/services/sumup";
import supabase from "@/lib/supabase";
import { sendTgLog } from "@/lib/tg-logger";


export async function POST(req: Request) {
    const {
        iccid,
        net_price,
        original_price,
        total_price,
        total_price_eur,
        total_price_ton,
        telegram_id,
        package_id,
        coverage,
        image_url,
        validity,
        data,
    } = await req.json();
    const description = `esim4u.t.me - ${package_id}`;

    const order = await supabase
        .from("orders")
        .insert({
            iccid: iccid,
            telegram_id: telegram_id || 0,
            package_id: package_id,
            coverage: coverage,
            image_url: image_url,
            price: {
                net: net_price,
                original: original_price,
                total: total_price, //original price + 20% + ceil to whole number
                profit: total_price - net_price,
                total_eur: total_price_eur,
                total_ton: total_price_ton,
                currency: "USD",
            },
            description: description,
            type: "TOPUP",
            validity: validity,
            data: data,
        })
        .select();

    if (order.error) {
        return Response.json(order.error);
    }

    const id = await createCheckout(
        `tg-esim-topup-${order.data[0].id}`,
        total_price_eur,
        description,
        "EUR",
    );

    await sendTgLog(`Sumup id for topup: ${id}`);

    const transaction = await supabase
        .from("transactions")
        .insert({
            telegram_id: telegram_id || 0,
            checkout_id: id,
            type: "ORDER",
            description: description,
        })
        .select();

    if (transaction.error) {
        console.error(transaction.error);
        return Response.json(transaction.error);
    }

    await supabase
        .from("orders")
        .update({ transaction_id: transaction.data[0].id })
        .eq("id", order.data[0].id);

    return Response.json({
        order_id: order.data[0].id,
        transaction_id: transaction.data[0].id,
        sumup_id: id,
    });
}
