import { updateUserActivity } from "@/services/supabase";

export async function POST(req: Request) {
    const { chat_id, newsletter_id, story_id } = await req.json();
    try {
        const data = await updateUserActivity({
            telegram_id: chat_id,
            newsletter_id,
            story_id,
        });
        return Response.json(data);
    } catch (error) {
        return Response.json(error);
    }
}
