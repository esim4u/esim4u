import { sendAdminTgLog, sendTgLog } from "@/lib/tg-logger";

export async function POST(req: Request) {
	const body = await req.json();
	console.log(body);
	await sendTgLog(JSON.stringify(body, null, 2));
}
