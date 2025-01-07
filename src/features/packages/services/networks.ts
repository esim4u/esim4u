"use server";

import axios from "axios";

const AIRALO_API_URL = process.env.AIRALO_API_URL;
const AIRALO_BUSINESS_ACCESS_TOKEN = process.env.AIRALO_BUSINESS_ACCESS_TOKEN;

export async function getPackageNetworks(package_id: string) {
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
		throw new Error("No data found");
	}

	//find package with package_id
	const p = response.data.data.find((country: any) =>
		country.operators.some((operator: any) =>
			operator.packages.some((p: any) => p.id === package_id)
		)
	);

	if (p && p.operators && p.operators.length > 0) {
		return p.operators[0].coverages;
	}

	throw new Error("Package not found");
}
