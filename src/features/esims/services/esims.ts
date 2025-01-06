"use server";

import supabase from "@/lib/supabase";
import { ORDER_STATUS } from "../enums";

export async function getUserEsims(telegram_id: number) {
	const user = await supabase
		.from("users")
		.select()
		.eq("telegram_id", telegram_id);

	if (user.error) {
		throw new Error("An error occurred while fetching user data");
	}
	if (user.data.length == 0) {
		throw new Error("User not found");
	}

	const orders = await supabase
		.from("orders")
		.select("*")
		.eq("telegram_id", telegram_id)
		.eq("type", "ESIM")
		.in("status", [ORDER_STATUS.SUCCESS, ORDER_STATUS.PENDING]);

	if (orders.error) {
		throw new Error("An error occurred while fetching orders");
	}

	return orders.data;
}
