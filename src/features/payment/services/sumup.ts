"use server";

import { serverEnvs } from "@/env/server";
import axios from "axios";

const SUMUP_API_URL = serverEnvs.SUMUP_API_URL || "";
const SUMUP_APP_ID = serverEnvs.SUMUP_APP_ID || "";
const SUMUP_SECRET_KEY = serverEnvs.SUMUP_SECRET_KEY || "";
const SUMUP_PROD_MERCHANT = serverEnvs.SUMUP_PROD_MERCHANT || "";

const SCOPE = ["payments"];

const getToken = async () => {
	let response = null;

	const data = new URLSearchParams();
	data.append("grant_type", "client_credentials");
	data.append("client_id", SUMUP_APP_ID);
	data.append("client_secret", SUMUP_SECRET_KEY);
	data.append("scope", SCOPE.join(","));

	response = await axios({
		method: "POST",
		headers: { "Content-Type": "application/x-www-form-urlencoded" },
		url: "https://api.sumup.com/token",
		data,
	}).catch((error) => {
		console.log(error.response.data);
	});

	if (response?.data && response.data.access_token) {
		return response.data.access_token;
	}

	return null;
};

export const createSumupCheckout = async (
	order_id: string,
	price: number,
	description: string,
	currency = "USD"
) => {
	const token = await getToken();

	if (!token) {
		return null;
	}

	const response = await axios({
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json",
		},
		url: SUMUP_API_URL,
		data: {
			checkout_reference: order_id,
			amount: price,
			currency,
			merchant_code: SUMUP_PROD_MERCHANT,
			date: new Date().toISOString(),
			return_url: "https://esim4u-front.vercel.app/api/pay/sumup/webhook",
			redirect_url: "https://esim4u-front.vercel.app",
			description,
			transactions: [
				{
					amount: price,
					currency,
					id: order_id,
				},
			],
		},
	}).catch((error) => {
		console.log(error.response.data);
	});

	if (response?.data && response.data.id) {
		return response.data.id;
	}
	return response;
};
