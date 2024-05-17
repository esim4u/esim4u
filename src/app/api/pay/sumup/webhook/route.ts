import { createCheckout } from "@/services/sumup";
import { supabase } from "@/services/supabase";
import { ceil, floor } from "@/lib/utils";
import axios from "axios";
import { sendTgLog } from "@/services/tg-logger";

export async function POST(req: Request) {
    const payload = await req.json();

    await axios
        .get(
            `https://api.telegram.org/bot7140478549:AAEH-4xJ8FWeUEN6x_xa4tsu5NvG8pnRgeI/sendMessage?chat_id=473700512&text=${encodeURI(
                `Sumup webhook: ${JSON.stringify(payload)}`
            )}&parse_mode=html`
        )
        .catch((e) => {});

    return Response.json(payload);
}
