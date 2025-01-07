import axios from "axios";
import { CURRENCY } from "../constants";

export function getSupportedCurrencies() {
	return Object.values(CURRENCY);
}

export function setPreferredCurrency(currency_code: string, router: any) {
	if (typeof window !== "undefined") {
		const currency = CURRENCY[currency_code] ? currency_code : "usd";
		window.localStorage.setItem("currency", currency);
		router.refresh();
	}
}

export function getPreferredCurrencyCode() {
	if (typeof window !== "undefined") {
		let currency = window.localStorage.getItem("currency");

		currency = currency && CURRENCY[currency] ? currency : "usd";

		return currency;
	}
	return "usd";
}

export function getPreferredCurrency() {
	if (typeof window !== "undefined") {
		let currency = window.localStorage.getItem("currency");

		currency = currency && CURRENCY[currency] ? currency : "usd";

		return CURRENCY[currency];
	}
}
