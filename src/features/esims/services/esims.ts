"use server";

import supabase from "@/lib/supabase";
import { ESIM_STATE, ORDER_STATUS } from "../enums";
import { createSumupCheckout } from "@/features/payment/services/sumup";
import { NewEsim, NewTopup } from "../types";
import axios from "axios";
import { ceil } from "@/lib/utils";
import { EXCHANGE_RATE, MARGIN_RATE } from "@/features/payment/constants";
import { serverEnvs } from "@/env/server";
import { createStripePaymentIntent } from "@/features/payment/services/stripe";

const AIRALO_API_URL = serverEnvs.AIRALO_API_URL;
const AIRALO_BUSINESS_ACCESS_TOKEN = serverEnvs.AIRALO_BUSINESS_ACCESS_TOKEN;

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
}: NewEsim) {
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
}: NewTopup) {
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

export async function syncEsimsState(esimsPerCheckAmount = 10) {
	// select esims older than 1 hour
	const timestampzISOStr = new Date(
		Date.now() - 1 * 60 * 60 * 1000
	).toISOString();

	const orders = await supabase
		.from("orders")
		.select("*")
		.eq("type", "ESIM")
		.in("status", [ORDER_STATUS.SUCCESS, ORDER_STATUS.PENDING])
		.in("state", [
			ESIM_STATE.ACTIVE,
			ESIM_STATE.NOT_ACTIVE,
			ESIM_STATE.FINISHED,
		])
		.or(`updated_at.lte.${timestampzISOStr},updated_at.is.null`) // select orders older than 1 hour or null(new orders)
		.order("id", { ascending: false })
		.limit(esimsPerCheckAmount);

	if (orders.error) {
		throw new Error("An error occurred while fetching orders");
	}

	const updatedOrders = [];
	for (const esim of orders.data) {
		const usage = await axios
			.get(`${AIRALO_API_URL}/v2/sims/${esim.iccid}/usage`, {
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${AIRALO_BUSINESS_ACCESS_TOKEN}`,
				},
			})
			.then((res) => res.data)
			.catch((e) => e.response);

		if (usage && usage?.data?.status) {
			await supabase
				.from("orders")
				.update({
					state: usage?.data?.status,
					usage: {
						remaining: usage.data?.remaining,
						total: usage.data?.total,
					},
					expired_at: usage.data?.expired_at,
					updated_at: new Date(),
				})
				.eq("id", esim.id);
		}

		const availableTopups = await axios
			.get(`${AIRALO_API_URL}/v2/sims/${esim.iccid}/topups`, {
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${AIRALO_BUSINESS_ACCESS_TOKEN}`,
				},
			})
			.then((res) => res.data)
			.catch((e) => e.response);

		if (availableTopups && availableTopups?.data?.length) {
			availableTopups.data.forEach((topup: any) => {
				topup.total_price =
					ceil(topup.price + topup.price * MARGIN_RATE, 0) - 0.01; //ceil to whole number
				topup.total_price_eur = ceil(
					topup.total_price * EXCHANGE_RATE,
					2
				);
			});

			const updatedOrder = await supabase
				.from("orders")
				.update({
					available_topups: availableTopups.data,
				})
				.eq("id", esim.id)
				.select(
					"id, iccid, transaction_id, created_at, coverage, package_id, usage, available_topups, type, status, state"
				);

			if (updatedOrder.error) {
				throw new Error(updatedOrder.error.message);
			}

			updatedOrders.push(updatedOrder.data);
		}
	}

	return updatedOrders;
}
