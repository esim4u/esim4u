import { supabase } from "@/services/supabase";
import { sendAdminTgLog } from "@/services/tg-logger";

export const maxDuration = 50;
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
    // fetch supabase users for last 24 hours
    const twentyFourHoursAgo = new Date(
        new Date().getTime() - 1 * 24 * 60 * 60 * 1000,
    ).toISOString();

    const users = await supabase
        .from("users")
        .select("*")
        .gte("created_date", twentyFourHoursAgo);

    if (users.error) {
        console.log("An cron error occurred while fetching users");

        return Response.json(
            {
                message: "An error occurred while fetching users",
                description: users.error.message,
            },
            { status: 500 },
        );
    }

    await sendAdminTgLog(
        `${users.data.length} new users signed up in the last 24 hours`,
    );

    return Response.json({ status: 200 });
}
