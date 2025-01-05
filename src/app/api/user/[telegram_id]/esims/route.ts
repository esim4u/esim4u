import { ORDER_STATUS } from "@/features/esims/enums";
import supabase from "@/lib/supabase";

export const maxDuration = 50;
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET(
	request: Request,
	{ params }: { params: { telegram_id: string } }
) {
	const telegram_id = params.telegram_id;

	if (!telegram_id) {
		return Response.json(
			{
				message: "Telegram ID is required",
			},
			{ status: 403 }
		);
	}

	const user = await supabase
		.from("users")
		.select()
		.eq("telegram_id", telegram_id);

	if (user.error) {
		return Response.json(
			{
				message: "An error occurred while fetching user data",
			},
			{ status: 500 }
		);
	}
	if (user.data.length == 0) {
		return Response.json(
			{
				message: "User not found",
			},
			{ status: 404 }
		);
	}

	const orders = await supabase
		.from("orders")
		.select("*")
		.eq("telegram_id", telegram_id)
		.eq("type", "ESIM")
		.in("status", [ORDER_STATUS.SUCCESS, ORDER_STATUS.PENDING]);

	if (orders.error) {
		return Response.json(
			{
				message: "An error occurred while fetching orders",
				description: orders.error.message,
			},
			{ status: 500 }
		);
	}

	if (orders.data.length == 0) {
		return Response.json(
			{
				message: "No orders found",
			},
			{ status: 404 }
		);
	}

	return Response.json(orders.data, { status: 200 });
}
