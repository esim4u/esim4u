import {
    sendMessageToMultipleUsers,
    sendWelcomeMessageToUser,
} from "@/services/grammy";
import { supabase } from "@/services/supabase";

export const maxDuration = 50;
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
    // const users = await supabase.from("users").select("id");
    const users = [473700512, 258793];

    users.forEach(async (user) => {
        await sendWelcomeMessageToUser(user);
    });

    return Response.json({ status: 200 });
}
