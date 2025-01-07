"use server";

import axios from "axios";

const AIRALO_API_URL = process.env.AIRALO_API_URL;
const AIRALO_BUSINESS_ACCESS_TOKEN = process.env.AIRALO_BUSINESS_ACCESS_TOKEN;

export async function getEsimCompatibleDevices() {
	const response = await axios.get(
		`${AIRALO_API_URL}/v2/compatible-devices`,
		{
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${AIRALO_BUSINESS_ACCESS_TOKEN}`,
			},
		}
	);

	if (!response?.data || !response.data.data) {
		throw new Error("No data found");
	}

	return response.data.data;
}
