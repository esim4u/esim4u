import { syncEsimsState } from "@/features/esims/services/esims";

export const maxDuration = 50;

export async function GET() {
	try {
		const updatedOrders = await syncEsimsState();
		return Response.json(
			{
				message: "Successfully synced esims state",
				updatedAmount: updatedOrders.length,
				updatedOrders: updatedOrders,
			},
			{ status: 200 }
		);
	} catch (error: any) {
		return Response.json(
			{
				message: "An error occurred while syncing esims state",
				description: error.message,
			},
			{ status: 500 }
		);
	}
}
