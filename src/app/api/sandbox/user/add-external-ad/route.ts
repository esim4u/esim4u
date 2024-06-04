import { addExternalAdUser } from "@/services/supabase";

export async function POST(req: Request) {
    const { chat_id, username, match } = await req.json();
    try {
        const data = await addExternalAdUser(chat_id, username, match);
        return Response.json(data);
    } catch (error) {
        return Response.json(error);
    }

}
