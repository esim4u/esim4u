import { sendMessageToMultipleUsers } from "@/services/grammy";
import { supabase } from "@/services/supabase";

export const maxDuration = 50;
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
    const newsletters = await supabase
        .from("newsletter")
        .select("*")
        .in("status", ["ACTIVE"]);

    if (newsletters.error) {
        console.log("An cron error occurred while fetching newsletters");

        return Response.json(
            {
                message: "An error occurred while fetching newsletters",
                description: newsletters.error.message,
            },
            { status: 500 },
        );
    }
    if(newsletters.data.length === 0) {
        return Response.json({
            message: "No active newsletters found",
            description: "There are no active newsletters to send",
        },{ status: 200 });
    }

    newsletters.data.forEach(async (newsletter) => {
        const triggered_at = [...newsletter.triggered_at, new Date()];
        await supabase
            .from("newsletters")
            .update({
                triggered_at,
            })
            .eq("id", newsletter.id);
    });

    // const users = await supabase.from("users").select("id");
    const users = [473700512, 258793];

    await sendMessageToMultipleUsers({
        chatIds: users,
        message: newsletters.data[0].message,
        image_url: newsletters.data[0].image_url,
        match_query: "newsletter=" + newsletters.data[0].id,
    }

    );

    return Response.json({ status: 200 });
}
