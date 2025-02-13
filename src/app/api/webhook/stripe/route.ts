import { sendTgLog } from "@/lib/tg-logger";
import { after } from "next/server";

export async function POST(req: Request) {
	const body = await req.json();
	console.log(body);

	sendTgLog(JSON.stringify(body, null, 2))

	return Response.json(
		{
			message: "Successfully logged the webhook event",
		},
		{ status: 200 }
	);
}
