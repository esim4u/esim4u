import { sendTgLog } from "@/services/tg-logger";

export async function GET() {
    const result = await fetch(
        "http://worldtimeapi.org/api/timezone/America/Chicago",
        {
            cache: "no-store",
        }
    );
    const data = await result.json();

    await sendTgLog("cron");

    return Response.json({ datetime: data.datetime });
}
