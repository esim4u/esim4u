import { getNewUsersAmount } from "@/features/analytics/service";
import { sendAdminTgLog } from "@/lib/tg-logger";
import { after } from "next/server";

export const maxDuration = 50;

export async function GET() {
	try {
		const { newUsersAmount, totalUsersAmount } = await getNewUsersAmount();
		after(sendAdminTgLog(
			`In the past 24 hours: \nNew users: ${newUsersAmount} \nTotal users: ${totalUsersAmount}`
		));
		return Response.json(
			{
				message: "Successfully fetched new users amount",
				newUsersAmount,
				total: totalUsersAmount,
			},
			{ status: 200 }
		);
	} catch (error: any) {
		return Response.json(
			{
				message: "An error occurred while fetching new users amount",
				description: error.message,
			},
			{ status: 500 }
		);
	}
}
