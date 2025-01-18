"use server";

import { serverEnvs } from "@/env/server";
import axios from "axios";

const TG_LOGGER_BOT_TOKEN = serverEnvs.TG_LOGGER_BOT_TOKEN;
const members = [473700512];

const ADMIN_TG_LOGGER_BOT_TOKEN = serverEnvs.ADMIN_BOT_TOKEN;
const admins = [473700512, 258793];

export const sendTgLog = async (message: string) => {
	members.forEach(async (chat_id) => {
		await fetch(
			`https://api.telegram.org/bot${TG_LOGGER_BOT_TOKEN}/sendMessage?chat_id=${chat_id}&text=${encodeURI(
				message
			)}&parse_mode=html`
		).catch((e) => {});
	});
};

export const sendAdminTgLog = async (message: string) => {
	admins.forEach(async (chat_id) => {
		await fetch(
			`https://api.telegram.org/bot${ADMIN_TG_LOGGER_BOT_TOKEN}/sendMessage?chat_id=${chat_id}&text=${encodeURI(
				message
			)}&parse_mode=html`
		).catch((e) => {});
	});
};
