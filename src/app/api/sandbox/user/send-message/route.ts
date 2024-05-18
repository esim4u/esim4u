import { sendMessagesToUser, sendPhotoToUser } from "@/services/grammy";

export async function POST(req: Request) {
    const { chat_id, message } = await req.json();

    try {
        await sendMessagesToUser(chat_id, message);
    } catch (error) {
        return Response.json(error);
    }

    return Response.json(message);
}
