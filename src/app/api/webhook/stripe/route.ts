import { sendTgLog } from "@/lib/tg-logger";
import { after } from "next/server";

export async function POST(req: Request) {
	const body = await req.json();
	console.log(body);

	// Log the webhook event to the Telegram without blocking the response
	after(sendTgLog(JSON.stringify(body, null, 2)))

	return Response.json(
		{
			message: "Successfully logged the webhook event",
		},
		{ status: 200 }
	);
}
