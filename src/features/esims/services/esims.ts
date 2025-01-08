"use server";

import supabase from "@/lib/supabase";
import { ORDER_STATUS } from "../enums";
import { createCheckout } from "@/features/payment/services/sumup";
import { NewEsim, NewTopup } from "../types";

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

    const id = await createCheckout(
        `tg-esim-${order.data[0].id}`,
        total_price_eur,
        description,
        "EUR"
    );
	
	if (!id) {
		throw new Error("An error occurred while creating checkout");
	}

    const transaction = await supabase
        .from("transactions")
        .insert({
            telegram_id: telegram_id || 0,
            checkout_id: id,
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
		sumup_id: id,
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

	const id = await createCheckout(
		`tg-esim-topup-${order.data[0].id}`,
		total_price_eur,
		description,
		"EUR"
	);

	if (!id) {
		throw new Error("An error occurred while creating checkout");
	}

	const transaction = await supabase
		.from("transactions")
		.insert({
			telegram_id: telegram_id || 0,
			checkout_id: id,
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
		sumup_id: id,
	};
}
