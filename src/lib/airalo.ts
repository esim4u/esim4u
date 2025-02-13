"use server";

import axios from "axios";
import redis from "./redis";
import { serverEnvs } from "@/env/server";

export async function getAiraloToken() {
	const airaloTokenRedisKey =
		serverEnvs.AIRALO_API_URL === "https://sandbox-partners-api.airalo.com"
			? "airalo_token_sandbox"
			: "airalo_token";
	const token = await redis.get(airaloTokenRedisKey);
	console.log("token", token);
	if (token) {
		return token;
	} else {
		//create a new token

		const response = await axios.post(
			`${serverEnvs.AIRALO_API_URL}/v2/token`,
			{
				client_id: serverEnvs.AIRALO_CLIENT_ID,
				client_secret: serverEnvs.AIRALO_CLIENT_SECRET,
			}
		);
		if (!response.data.access_token || !response.data.expires_in) {
			throw new Error("Invalid response from Airalo API");
		}
		const newToken = response.data.access_token;
		await redis.set(airaloTokenRedisKey, newToken, {
			ex: response.data.expires_in,
		});

		return newToken;
	}
}
