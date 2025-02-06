import { sendTgLog } from "@/lib/tg-logger";

export async function POST(req: Request) {
	const body = await req.json();
	await sendTgLog(JSON.stringify(body, null, 2));
	return Response.json(
		{
			message: "Successfully logged the webhook event",
		},
		{ status: 200 }
	);
}
