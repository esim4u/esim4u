import { sendPhotoToUser } from "@/services/grammy";

export async function POST(req: Request) {
    const { chat_id, photo_url, caption } = await req.json();

    try {
        await sendPhotoToUser(chat_id, photo_url, caption);
    } catch (error) {
        return Response.json(error);
    }

    return Response.json(photo_url);
}
