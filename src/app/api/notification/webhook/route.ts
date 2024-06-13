import { sendTgLog } from "@/services/tg-logger";

export async function GET(req: Request) {
    const payload = await req.json();

    await sendTgLog("NOTIFICATION WEBHOOK PAYLOAD: " + JSON.stringify(payload));

    return Response.json(payload, { status: 200 });
}
