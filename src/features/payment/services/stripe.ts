"use server";

import { serverEnvs } from "@/env/server";
import Stripe from "stripe";
import { convertToCents } from "../lib/utils";

const STRIPE_SECRET_KEY = serverEnvs.STRIPE_SECRET_KEY;
const stripe = new Stripe(STRIPE_SECRET_KEY);

interface StripeCustomer {
	name?: string;
	metadata: {
		telegram_id: string;
	};
}

interface CreateStripePaymentIntentProps {
	order_id: string;
	price: number;
	description: string;
	currency: "usd";
	customer: StripeCustomer;
}

export const createStripePaymentIntent = async ({
	order_id,
	price,
	description,
	currency,
	customer,
}: CreateStripePaymentIntentProps) => {
	const stripeCustomerId = await getStripeCustomerId(customer);
	const priceInCents = convertToCents(price);

	return await stripe.paymentIntents.create({
		amount: priceInCents,
		currency,
		description,
		metadata: {
			order_id,
		},
		customer: stripeCustomerId,
	});
};

export const updateStripePaymentIntentMetadata = async ({
	paymentIntentId,
	metadata,
}: {
	paymentIntentId: string;
	metadata: Record<string, any>;
}) => {
	const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
	
	const oldMetadata = paymentIntent.metadata;
	const newMetadata = { ...oldMetadata, ...metadata };

	return await stripe.paymentIntents.update(paymentIntentId, {
		metadata: newMetadata,
	});
};

export const getStripeCustomerId = async (customer: StripeCustomer) => {
	let stripeCustomerId = "";

	const previouslyCreatedStripeCustomers = await stripe.customers.search({
		query: `metadata[\'telegram_id\']:${customer.metadata.telegram_id}`,
		limit: 1,
	});

	if (previouslyCreatedStripeCustomers.data.length > 0) {
		stripeCustomerId = previouslyCreatedStripeCustomers.data[0].id;
	} else {
		const stripeCustomer = await stripe.customers.create(customer);
		stripeCustomerId = stripeCustomer.id;
	}

	return stripeCustomerId;
};

export const getStripePaymentIntent = async (paymentIntentId: string) => {
	return await stripe.paymentIntents.retrieve(paymentIntentId);
};
