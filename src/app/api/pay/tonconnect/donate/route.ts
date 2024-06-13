import { supabase } from "@/services/supabase";

export async function POST(req: Request) {
    const { telegram_id, amount, boc } = await req.json();

    if(!telegram_id || !amount || !boc || amount < 1) {
        return Response.json({ error: "Invalid request" });
    }

    const transaction = await supabase
        .from("transactions")
        .insert({
            telegram_id,
            amount,
            boc,
            description: `esim4u.t.me ${amount} TON donation`,
            currency: "TON",
            status: "SUCCESS",
            merchant: "TONCONNECT",
            type: "DONATION"
        })
        .select();

    return Response.json(transaction);
}
