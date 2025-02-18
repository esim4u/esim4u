"use server";

import supabase from "@/lib/supabase";
import {
	createStripePaymentIntent,
	updateStripePaymentIntentMetadata,
} from "../../payment/services/stripe";
import { NewEsimOrderData, NewTopupOrderData } from "../types";
import { sendAdminTgLog } from "@/lib/tg-logger";
import { buyEsim } from "./esims";
import { ORDER_STATUS } from "../enums";
import { TRANSACTION_STATUS } from "@/features/payment/enums";

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
			status: ORDER_STATUS.CREATED,
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
			status: TRANSACTION_STATUS.CREATED,
			description: description,
		})
		.select();

	if (transaction.error) {
		throw new Error(transaction.error.message);
	}

	await updateStripePaymentIntentMetadata({
		paymentIntentId: stripeId,
		metadata: {
			transaction_id: transaction.data[0].id,
		},
	});

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
			status: ORDER_STATUS.CREATED,
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
			status: TRANSACTION_STATUS.CREATED,
			description: description,
		})
		.select();

	if (transaction.error) {
		throw new Error(transaction.error.message);
	}

	await updateStripePaymentIntentMetadata({
		paymentIntentId: stripeId,
		metadata: {
			transaction_id: transaction.data[0].id,
		},
	});

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

export const completeEsimOrderByTransactionId = async (
	transaction_id: string | number
) => {
	const order = await supabase
		.from("orders")
		.update({ status: ORDER_STATUS.PENDING })
		.eq("transaction_id", transaction_id)
		.eq("status", ORDER_STATUS.CREATED)
		.select();

	if (order.error || order.data.length === 0) {
		throw new Error("Order not found");
	}

	const createdOrder = order.data[0];

	await sendAdminTgLog(
		`🎯${createdOrder.type} order №${createdOrder.id} is purchased! 
			\nCoverage: ${createdOrder.coverage} 
			\n\nTransaction ID: ${createdOrder.transaction_id}
			\nAmount: ${createdOrder.price.total_eur} EUR
			\nMerchant: Sumup\n`
	);

	if (createdOrder.type === "ESIM") {
		const boughtEsim = await buyEsim({
			package_id: createdOrder.package_id,
			order_id: createdOrder.id,
		});
		await sendAdminTgLog(
			`ORDER COMPLETED: 🎯${createdOrder.type} order №${
				createdOrder.id
			} is completed! 
			Esim details: ${JSON.stringify(boughtEsim)}`
		);

		return boughtEsim;
	} else if (createdOrder.type === "TOPUP") {
		await sendAdminTgLog(`TODO: Implement topup order completion`);
	}
};
