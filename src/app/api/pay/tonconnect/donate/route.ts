import supabase from "@/lib/supabase";
import { sendAdminTgLog } from "@/lib/tg-logger";


export async function POST(req: Request) {
    const { telegram_id, amount, boc } = await req.json();

    if (!telegram_id || !amount || !boc || amount < 1) {
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
            type: "DONATION",
        })
        .select();

    if (transaction.error || !transaction.data.length) {
        return Response.json({ error: "Transaction not found" });
    }

    const users = await supabase
        .from("users")
        .select("*")
        .eq("telegram_id", telegram_id);

    if (users.error || !users.data.length) {
        return Response.json({ error: "User not found" });
    }

    await sendAdminTgLog(
        `🍩Someone donated ${amount} TON \n\nUsername: @${users.data[0].username}\nTransaction ID: ${transaction.data[0].id}`,
    );
    return Response.json(transaction);
}
