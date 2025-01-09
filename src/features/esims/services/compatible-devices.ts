"use server";

import { serverEnvs } from "@/env/server";
import axios from "axios";

const AIRALO_API_URL = serverEnvs.AIRALO_API_URL;
const AIRALO_BUSINESS_ACCESS_TOKEN = serverEnvs.AIRALO_BUSINESS_ACCESS_TOKEN;

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
