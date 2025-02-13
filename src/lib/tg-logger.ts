"use server";

import { serverEnvs } from "@/env/server";
import { set } from "zod";

const TG_LOGGER_BOT_TOKEN = serverEnvs.TG_LOGGER_BOT_TOKEN;
const members = [473700512];

const ADMIN_TG_LOGGER_BOT_TOKEN = serverEnvs.ADMIN_BOT_TOKEN;
const admins = [473700512, 258793];

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const sendTgLog = async (message: string) => {
	await sleep(4000);

	await Promise.all(
		members.map((chat_id) =>
			fetch(
				`https://api.telegram.org/bot${TG_LOGGER_BOT_TOKEN}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(
					message
				)}&parse_mode=html`
			).catch((e) => console.error("Error sending Telegram message:", e))
		)
	);
	await sleep(1000);
};

export const sendAdminTgLog = async (message: string) => {
	await Promise.all(
		admins.map((chat_id) =>
			fetch(
				`https://api.telegram.org/bot${ADMIN_TG_LOGGER_BOT_TOKEN}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(
					message
				)}&parse_mode=html`
			).catch((e) => console.error("Error sending Telegram message:", e))
		)
	);
};
