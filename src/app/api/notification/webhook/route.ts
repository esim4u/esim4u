import { sendTgLog } from "@/services/tg-logger";

export async function GET(req: Request) {

    await sendTgLog("NOTIFICATION WEBHOOK PAYLOAD:");

    return Response.json( { status: 200 });
}
