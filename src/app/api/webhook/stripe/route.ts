import { sendTgLog } from "@/lib/tg-logger";
import { after } from "next/server";

export async function POST(req: Request) {
	const body = await req.json();
	console.log(body);
	// Schedule a side-effect after the response is sent
	after(async () => {
		// For example, log or increment analytics in the background
		await sendTgLog(JSON.stringify(body, null, 2));
	});
	
	return Response.json(
		{
			message: "Successfully logged the webhook event",
		},
		{ status: 200 }
	);
}
