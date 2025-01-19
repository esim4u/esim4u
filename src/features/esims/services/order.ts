"use server";

import supabase from "@/lib/supabase";
import { createStripePaymentIntent } from "../../payment/services/stripe";
import { NewEsimOrderData, NewTopupOrderData } from "../types";

export async function createEsimOrder({
	net_price,
	original_price,
	total_price,
	total_price_eur,
	total_price_ton,
	telegram_id,
	package_id,
	image_url,
	coverage,
	validity,
	data,
}: NewEsimOrderData) {
	const description = `esim4u.t.me - ${package_id}`;

	const order = await supabase
		.from("orders")
		.insert({
			telegram_id: telegram_id || 0,
			package_id: package_id,
			coverage: coverage,
			image_url: image_url,
			price: {
				net: net_price,
				original: original_price,
				total: total_price, //original price + 20% + ceil to whole number
				profit: total_price - net_price,
				total_eur: total_price_eur,
				total_ton: total_price_ton,
				currency: "USD",
			},
			description: description,
			type: "ESIM",
			validity: validity,
			data: data,
		})
		.select();

	if (order.error) {
		throw new Error(order.error.message);
	}

	const { id: stripeId } = await createStripePaymentIntent({
		order_id: order.data[0].id,
		price: total_price,
		description: description,
		currency: "usd",
		customer: {
			metadata: {
				telegram_id: telegram_id.toString(),
			},
		},
	});

	const transaction = await supabase
		.from("transactions")
		.insert({
			telegram_id: telegram_id || 0,
			stripe_id: stripeId,
			type: "ORDER",
			description: description,
		})
		.select();

	if (transaction.error) {
		throw new Error(transaction.error.message);
	}

	await supabase
		.from("orders")
		.update({ transaction_id: transaction.data[0].id })
		.eq("id", order.data[0].id);

	return {
		order_id: order.data[0].id,
		transaction_id: transaction.data[0].id,
		stripe_id: stripeId,
	};
}

export async function createTopupOrder({
	iccid,
	net_price,
	original_price,
	total_price,
	total_price_eur,
	total_price_ton,
	telegram_id,
	package_id,
	image_url,
	coverage,
	validity,
	data,
}: NewTopupOrderData) {
	const description = `esim4u.t.me - ${package_id}`;

	const order = await supabase
		.from("orders")
		.insert({
			iccid: iccid,
			telegram_id: telegram_id || 0,
			package_id: package_id,
			coverage: coverage,
			image_url: image_url,
			price: {
				net: net_price,
				original: original_price,
				total: total_price, //original price + 20% + ceil to whole number
				profit: total_price - net_price,
				total_eur: total_price_eur,
				total_ton: total_price_ton,
				currency: "USD",
			},
			description: description,
			type: "TOPUP",
			validity: validity,
			data: data,
		})
		.select();

	if (order.error) {
		throw new Error(order.error.message);
	}

	const { id: stripeId } = await createStripePaymentIntent({
		order_id: order.data[0].id,
		price: total_price,
		description: description,
		currency: "usd",
		customer: {
			metadata: {
				telegram_id: telegram_id.toString(),
			},
		},
	});

	const transaction = await supabase
		.from("transactions")
		.insert({
			telegram_id: telegram_id || 0,
			stripe_id: stripeId,
			type: "ORDER",
			description: description,
		})
		.select();

	if (transaction.error) {
		throw new Error(transaction.error.message);
	}
	await supabase
		.from("orders")
		.update({ transaction_id: transaction.data[0].id })
		.eq("id", order.data[0].id);

	return {
		order_id: order.data[0].id,
		transaction_id: transaction.data[0].id,
		stripe_id: stripeId,
	};
}

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
