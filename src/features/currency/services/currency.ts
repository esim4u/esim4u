"use server";

import axios from "axios";

export async function getTonUsdRate() {
	const { data } = await axios.get(
		"https://tonapi.io/v2/rates?tokens=ton&currencies=usd"
	);
	return data.rates.TON.prices.USD;
}
