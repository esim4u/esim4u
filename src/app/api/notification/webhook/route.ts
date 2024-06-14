import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { sendTgLog } from "@/services/tg-logger";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const iccid = searchParams.get("iccid");

    await sendTgLog(
        "NOTIFICATION WEBHOOK PAYLOAD:" + JSON.stringify({ iccid }),
    );

    return Response.json({ status: 200 });
}
