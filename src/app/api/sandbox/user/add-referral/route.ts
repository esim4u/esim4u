import { sendMessagesToUser, sendPhotoToUser } from "@/services/grammy";
import { addReferrerToUser } from "@/services/supabase";

export async function POST(req: Request) {
    const { chat_id, username, referrer_id } = await req.json();
    try {
        const data = await addReferrerToUser(chat_id, username, referrer_id);
        return Response.json(data);
    } catch (error) {
        return Response.json(error);
    }

}
