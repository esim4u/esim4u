import { sendMessagesToUser, sendPhotoToUser } from "@/services/grammy";
import { addReferrerToUser, incrementStoryTotalViews } from "@/services/supabase";

export async function POST(req: Request) {
    const { story_id } = await req.json();
    try {
        const data = await incrementStoryTotalViews(story_id);
        return Response.json(data);
    } catch (error) {
        return Response.json(error);
    }

}
