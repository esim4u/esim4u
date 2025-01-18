"use server";

import supabase from "@/lib/supabase";
import { getStripePaymentIntent } from "./stripe";

export const getCreatedOrderById = async (order_id: string | number) => {
	const orders = await supabase
		.from("orders")
		.select(`*`)
		.eq("id", order_id)
		.eq("status", "CREATED")
		.order("created_at", { ascending: false });

	if (orders.error || orders.data.length === 0) {
		throw new Error("Order not found");
	}

	const transactions = await supabase
		.from("transactions")
		.select(`checkout_id, stripe_id`)
		.eq("id", orders.data[0].transaction_id);

	if (transactions.error || transactions.data.length === 0) {
		throw new Error("Transaction not found");
	}

	// let stripe_client_secret;
	// if (transactions.data[0].stripe_id) {
	// 	const { client_secret } = await getStripePaymentIntent(
	// 		transactions.data[0].stripe_id
	// 	);
	// 	stripe_client_secret = client_secret;
	// }

	return {
		...orders.data[0],
		checkout_id: transactions.data[0].checkout_id,
		stripe_id: transactions.data[0].stripe_id,
	};
};

export const getOrderById = async (order_id: string | number) => {
	const orders = await supabase
		.from("orders")
		.select(`*`)
		.eq("id", order_id)
		.order("created_at", { ascending: false });

	if (orders.error || orders.data.length === 0) {
		throw new Error("Order not found");
	}

	const transactions = await supabase
		.from("transactions")
		.select(`checkout_id`)
		.eq("id", orders.data[0].transaction_id);

	if (transactions.error || transactions.data.length === 0) {
		throw new Error("Transaction not found");
	}

	return { ...orders.data[0], checkout_id: transactions.data[0].checkout_id };
};
