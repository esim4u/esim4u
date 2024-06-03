import { sendTgLog } from "@/services/tg-logger";

export async function GET() {

    await sendTgLog("cron stated processing esims orders: " );

    const result = await fetch(
        "http://worldtimeapi.org/api/timezone/America/Chicago",
        {
            cache: "no-store",
        }
    );
    const data = await result.json();

    return Response.json({ datetime: data.datetime });
}
