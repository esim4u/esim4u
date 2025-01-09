"use server";

import axios from "axios";
import t from "@/assets/data/country-translations.json";
import { Translations } from "@/features/locale/types/translations.types";
import { ceil } from "@/lib/utils";
import { EXCHANGE_RATE, MARGIN_RATE } from "@/features/payment/constants";
import { serverEnvs } from "@/env/server";

const AIRALO_API_URL = serverEnvs.AIRALO_API_URL;
const AIRALO_BUSINESS_ACCESS_TOKEN = serverEnvs.AIRALO_BUSINESS_ACCESS_TOKEN;

const translations: Translations = t as Translations;
const supportedTranslations = Object.keys(translations);

export async function getEsimPackages({ lang }: { lang: string }) {
	const response = await axios.get(`${AIRALO_API_URL}/v2/packages`, {
		params: {
			limit: 300,
		},
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${AIRALO_BUSINESS_ACCESS_TOKEN}`,
		},
	});
	if (!response?.data || !response.data.data) {
		throw new Error("Failed to fetch packages");
	}

	//add total_price field to each package
	response.data.data.forEach((country: any) => {
		if (
			lang &&
			lang !== "en" &&
			supportedTranslations.includes(lang) &&
			translations[lang][country.country_code.toLowerCase()]
		) {
			country.translation =
				translations[lang][country.country_code.toLowerCase()];
		}

		country.operators.forEach((operator: any) => {
			operator.packages.forEach((p: any) => {
				p.total_price = ceil(p.price + p.price * MARGIN_RATE, 0) - 0.01; //ceil to whole number
				p.total_price_eur = ceil(p.total_price * EXCHANGE_RATE, 2);
			});
			operator.countries.forEach((c: any) => {
				if (
					lang &&
					lang !== "en" &&
					supportedTranslations.includes(lang) &&
					translations[lang][c.country_code.toLowerCase()]
				) {
					c.translation =
						translations[lang][c.country_code.toLowerCase()];
				}
			});
		});
	});

	return response.data.data;
}

export async function getCountryPackages({
	country_code,
}: {
	country_code: string;
}) {
	const response = await axios.get(`${AIRALO_API_URL}/v2/packages`, {
		params: {
			limit: 300,
			"filter[country]":
				country_code.length == 2
					? country_code.toUpperCase()
					: undefined,

			"filter[type]": country_code.length != 2 ? "global" : undefined,
		},
		headers: {
			Accept: "application/json",
			Authorization: `Bearer ${AIRALO_BUSINESS_ACCESS_TOKEN}`,
		},
	});

	if (
		!response?.data ||
		!response.data.data ||
		response.data.data.length === 0
	) {
		throw new Error("Failed to fetch packages");
	}

	if (country_code.length > 2) {
		response.data.data = response.data.data.filter(
			(country: any) => country.slug === country_code
		);
	}

	//add total_price field to each package
	response.data.data.forEach((country: any) => {
		country.operators.forEach((operator: any) => {
			operator.packages.forEach((p: any) => {
				p.total_price = ceil(p.price + p.price * MARGIN_RATE, 0) - 0.01; //ceil to whole number
				p.total_price_eur = ceil(p.total_price * EXCHANGE_RATE, 2);
			});
		});
	});

	return response.data.data[0];
}
