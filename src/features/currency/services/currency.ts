"use server";

import axios from "axios";
import { CURRENCY } from "../constants";

export async function getTonUsdRate() {
	const { data } = await axios.get(
		"https://tonapi.io/v2/rates?tokens=ton&currencies=usd"
	);
	return data.rates.TON.prices.USD;
}

export async function convertUsdToPreferredCurrency({
	currency_code,
	amount,
}: {
	currency_code: string;
	amount: number;
}) {
	if (currency_code === "usd") {
		return {
			amount: amount,
			currency: "usd",
			symbol: "$",
		};
	}

	const rates = await axios.get(
		"https://api.exchangerate-api.com/v4/latest/USD"
	);
	if (!rates.data.rates[currency_code.toUpperCase()]) {
		return {
			amount: amount,
			currency: "usd",
			symbol: "$",
		};
	}

	const result = amount * rates.data.rates[currency_code.toUpperCase()];
	return {
		amount: result.toFixed(2),
		currency: currency_code,
		symbol: CURRENCY[currency_code].symbol,
	};
}
