import { createWallet } from "@/services/supabase";

export async function POST(req: Request) {
    const { telegram_id, wallet_address } = await req.json();
    try {
        const data = await createWallet(telegram_id, wallet_address)
        return Response.json(data);
    } catch (error) {
        return Response.json(error);
    }

}
