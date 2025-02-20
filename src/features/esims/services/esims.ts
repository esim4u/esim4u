"use server";

import supabase from "@/lib/supabase";
import { ESIM_STATE, ORDER_STATUS } from "../enums";
import axios from "axios";
import { ceil } from "@/lib/utils";
import { EXCHANGE_RATE, MARGIN_RATE } from "@/features/payment/constants";
import { serverEnvs } from "@/env/server";
import { sendAdminTgLog } from "@/lib/tg-logger";
import { getAiraloToken } from "@/lib/airalo";

const AIRALO_API_URL = serverEnvs.AIRALO_API_URL;
const AIRALO_BUSINESS_ACCESS_TOKEN = await getAiraloToken();

export async function getUserEsims(telegram_id: number) {
	const user = await supabase
		.from("users")
		.select()
		.eq("telegram_id", telegram_id);

	if (user.error) {
		throw new Error("An error occurred while fetching user data");
	}
	if (user.data.length == 0) {
		throw new Error("User not found");
	}

	const orders = await supabase
		.from("orders")
		.select("*, order_id:id")
		.eq("telegram_id", telegram_id)
		.eq("type", "ESIM")
		.in("status", [ORDER_STATUS.SUCCESS, ORDER_STATUS.PENDING])
		.order("id", { ascending: false });

	if (orders.error) {
		console.error(orders.error);
		throw new Error("An error occurred while fetching orders");
	}

	return orders.data;
}

export async function buyEsim({
	package_id,
	order_id,
}: {
	package_id: string;
	order_id: number;
}) {
	const buyEsimResponse = await axios
		.post(
			process.env.AIRALO_API_URL + "/v1/orders",
			{
				package_id,
				quantity: 1,
			},
			{
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${AIRALO_BUSINESS_ACCESS_TOKEN}`,
				},
			}
		)
		.then((res) => res.data)
		.catch((e) => e.response);

	if (buyEsimResponse.error) {
		throw new Error(buyEsimResponse.error.message);
	}

	const esimDataResponse = await axios
		.get(
			process.env.AIRALO_API_URL +
				`/v2/sims/${buyEsimResponse.data.sims[0].iccid}`,
			{
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${AIRALO_BUSINESS_ACCESS_TOKEN}`,
				},
			}
		)
		.then((res) => res.data)
		.catch((e) => e.response);

	if (esimDataResponse.error) {
		throw new Error(esimDataResponse.error.message);
	}

	const esimUsageResponse = await axios
		.get(
			process.env.AIRALO_API_URL +
				`/v2/sims/${buyEsimResponse.data.sims[0].iccid}/usage`,
			{
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${AIRALO_BUSINESS_ACCESS_TOKEN}`,
				},
			}
		)
		.then((res) => res.data)
		.catch((e) => e.response);

	if (esimUsageResponse.error) {
		throw new Error(esimUsageResponse.error.message);
	}

	const boughtEsim = {
		iccid: buyEsimResponse.data.sims[0].iccid,
		qrcode_url: buyEsimResponse.data.sims[0].qrcode_url,

		sm_dp: esimDataResponse?.data?.lpa,
		confirmation_code: esimDataResponse?.data?.matching_id,

		state: esimUsageResponse?.data?.status,
		usage: {
			remaining: esimUsageResponse.data?.remaining,
			total: esimUsageResponse.data?.total,
		},
		expired_at: esimUsageResponse.data?.expired_at,
	};

	await supabase
		.from("orders")
		.update({
			iccid: boughtEsim.iccid,
			status: ORDER_STATUS.SUCCESS,
			qrcode_url: boughtEsim.qrcode_url,
			sm_dp: boughtEsim.sm_dp,
			confirmation_code: boughtEsim.confirmation_code,

			state: boughtEsim.state,
			usage: boughtEsim.usage,
			expired_at: boughtEsim.expired_at,
		})
		.eq("id", order_id)
		.select();

	return boughtEsim;
}

export async function syncEsimsState(esimsPerCheckAmount = 10) {
	// select esims older than 1 hour
	const timestampzISOStr = new Date(
		Date.now() - 1 * 60 * 60 * 1000
	).toISOString();

	const orders = await supabase
		.from("orders")
		.select("*")
		.eq("type", "ESIM")
		.in("status", [ORDER_STATUS.SUCCESS, ORDER_STATUS.PENDING])
		.in("state", [
			ESIM_STATE.ACTIVE,
			ESIM_STATE.NOT_ACTIVE,
			ESIM_STATE.FINISHED,
		])
		.or(`updated_at.lte.${timestampzISOStr},updated_at.is.null`) // select orders older than 1 hour or null(new orders)
		.order("id", { ascending: false })
		.limit(esimsPerCheckAmount);

	if (orders.error) {
		throw new Error("An error occurred while fetching orders");
	}

	const updatedOrders = [];
	for (const esim of orders.data) {
		const usage = await axios
			.get(`${AIRALO_API_URL}/v2/sims/${esim.iccid}/usage`, {
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${AIRALO_BUSINESS_ACCESS_TOKEN}`,
				},
			})
			.then((res) => res.data)
			.catch((e) => e.response);

		if (usage && usage?.data?.status) {
			await supabase
				.from("orders")
				.update({
					state: usage?.data?.status,
					usage: {
						remaining: usage.data?.remaining,
						total: usage.data?.total,
					},
					expired_at: usage.data?.expired_at,
					updated_at: new Date(),
				})
				.eq("id", esim.id);
		}

		const availableTopups = await axios
			.get(`${AIRALO_API_URL}/v2/sims/${esim.iccid}/topups`, {
				headers: {
					Accept: "application/json",
					Authorization: `Bearer ${AIRALO_BUSINESS_ACCESS_TOKEN}`,
				},
			})
			.then((res) => res.data)
			.catch((e) => e.response);

		if (availableTopups && availableTopups?.data?.length) {
			availableTopups.data.forEach((topup: any) => {
				topup.total_price =
					ceil(topup.price + topup.price * MARGIN_RATE, 0) - 0.01; //ceil to whole number
				topup.total_price_eur = ceil(
					topup.total_price * EXCHANGE_RATE,
					2
				);
			});

			const updatedOrder = await supabase
				.from("orders")
				.update({
					available_topups: availableTopups.data,
				})
				.eq("id", esim.id)
				.select(
					"id, iccid, transaction_id, created_at, coverage, package_id, usage, available_topups, type, status, state"
				);

			if (updatedOrder.error) {
				throw new Error(updatedOrder.error.message);
			}

			updatedOrders.push(updatedOrder.data);
		}
	}

	return updatedOrders;
}

export async function syncEsim({ iccid }: { iccid: string }) {
	const orders = await supabase
		.from("orders")
		.select("*")
		.eq("iccid", iccid)
		.eq("type", "ESIM");

	if (orders.error) {
		throw new Error("An error occurred while fetching orders");
	}

	const usage = await axios
		.get(process.env.AIRALO_API_URL + `/v2/sims/${iccid}/usage`, {
			headers: {
				Accept: "application/json",
				Authorization: `Bearer ${AIRALO_BUSINESS_ACCESS_TOKEN}`,
			},
		})
		.then((res) => res.data)
		.catch((e) => e.response);

	if (usage && usage?.data?.status) {
		const updatedOrder = await supabase
			.from("orders")
			.update({
				state: usage?.data?.status,
				usage: {
					remaining: usage.data?.remaining,
					total: usage.data?.total,
				},
				expired_at: usage.data?.expired_at,
			})
			.eq("id", orders.data[0].id)
			.select();

		if (updatedOrder.error) {
			return;
		}
		return Response.json(updatedOrder, { status: 200 });
	}
}
