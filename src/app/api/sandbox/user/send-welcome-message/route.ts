import { sendWelcomeMessageToUser } from "@/services/grammy";

export async function POST(req: Request) {
    const { chat_id } = await req.json();

    try {
        await sendWelcomeMessageToUser(chat_id);
    } catch (error) {
        return Response.json(error);
    }

    return Response.json({ message: "Welcome message sent" });
}
