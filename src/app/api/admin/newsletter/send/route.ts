import { sendMessageToMultipleUsers } from "@/lib/grammy";
import supabase from "@/lib/supabase";

export const maxDuration = 50;
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = "force-no-store";

enum NEWSLETTER_STATUS {
	DRAFT = "DRAFT",
	TO_SEND = "TO_SEND",
	DELIVERED = "DELIVERED",
}

export async function GET() {
	const newsletters = await supabase
		.from("newsletter")
		.select("*")
		.in("status", [NEWSLETTER_STATUS.TO_SEND]);

	if (newsletters.error) {
		console.log("An cron error occurred while fetching newsletters");

		return Response.json(
			{
				message: "An error occurred while fetching newsletters",
				description: newsletters.error.message,
			},
			{ status: 500 }
		);
	}
	if (newsletters.data.length === 0) {
		return Response.json(
			{
				message: "No active newsletters found",
				description: "There are no active newsletters to send",
			},
			{ status: 200 }
		);
	}

	newsletters.data.forEach(async (newsletter) => {
		const triggered_at = [new Date(), ...newsletter.triggered_at];
		await supabase
			.from("newsletter")
			.update({
				triggered_at,
				status: NEWSLETTER_STATUS.DELIVERED,
			})
			.eq("id", newsletter.id);
	});

	const users = await supabase.from("users").select("id");

	if (users.error) {
		console.log("An cron error occurred while fetching users");

		return Response.json(
			{
				message: "An error occurred while fetching users",
				description: users.error.message,
			},
			{ status: 500 }
		);
	}
	const userIds = users.data.map((user) => user.id);
	// const userIds = [473700512, 258793];

	await sendMessageToMultipleUsers({
		chatIds: userIds,
		message: newsletters.data[0].message,
		image_url: newsletters.data[0].image_url,
		match_query: "newsletter=" + newsletters.data[0].id,
		custom_button_url: newsletters.data[0].button_url,
		custom_button_title: newsletters.data[0].button_title,
	});

	return Response.json({ status: 200 });
}
