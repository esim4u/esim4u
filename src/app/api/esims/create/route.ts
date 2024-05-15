import { createCheckout } from "@/services/sumup";
import { supabase } from "@/services/supabase";
import { ceil, floor } from "@/lib/utils";
import axios from "axios";

export async function POST(req: Request) {
    const {
        original_price,
        total_price,
        total_price_ton,
        total_price_eur,
        telegram_id,
        package_id,
        coverage,
        coverage_image_url,
        networks,
    } = await req.json();

    const response = await supabase
        .from("airalo-esim")
        .insert({
            telegram_id: telegram_id || 0,
            airalo_package_id: package_id,
            coverage: coverage,
            coverage_image_url: coverage_image_url,
            networks: networks,
            price: {
                original: original_price,
                total: total_price, //original price + 20% + ceil to whole number
                total_price_eur: total_price_eur,
                total_price_ton: total_price_ton,
                airalo_profit: floor(original_price * 0.85),
                profit: ceil(total_price * 0.35), //35% of original price
                delta: ceil(total_price - floor(original_price * 0.85)), //full profit
                currency: "USD",
            },
        })
        .select();

    if (response.error) {
        return Response.json(response.error);
    }

    const id = await createCheckout(
        `esim-${response.data[0].id}`,
        total_price,
        `tg-esim-${response.data[0].id}`,
        "EUR"
    );

    await supabase
        .from("airalo-esim")
        .update({ sumup_id: id })
        .eq("id", response.data[0].id);

    return Response.json({
        order_id: response.data[0].id,
        sumup_id: id,
    });
}
