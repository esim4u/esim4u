import { createCheckout } from "@/services/sumup";
import { supabase } from "@/services/supabase";
import { ceil, floor } from "@/lib/utils";
import axios from "axios";
import { sendTgLog } from "@/services/tg-logger";

export async function POST(req: Request) {
    const payload = await req.json();

    await sendTgLog(`Sumup webhook: ${JSON.stringify(payload)}`);

    return Response.json(payload);
}
