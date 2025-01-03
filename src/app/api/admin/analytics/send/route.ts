import supabase from "@/lib/supabase";
import { sendAdminTgLog } from "@/lib/tg-logger";

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
        .select("id", { count: "exact" })
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

    const totalUserCount = await supabase.from("users").select("id", { count: "exact" });

    if(totalUserCount.error) {
        console.log("An error occurred while fetching total user count");
        return Response.json(
            {
                message: "An error occurred while fetching total user count",
                description: totalUserCount.error.message,
            },
            { status: 500 },
        );
    }

    sendAdminTgLog(
        `In the past 24 hours: \nNew users: ${users.count} \nTotal users: ${totalUserCount.count}`,
    );

    return Response.json({ status: 200 });
}
