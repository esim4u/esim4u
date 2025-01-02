import { Bot, InlineKeyboard, InputFile } from "grammy";

import userService from "@/features/users/services/user.service";
import { l } from "../features/locale/lib/locale";

const token = process.env.NEXT_PUBLIC_BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is unset");
const bot = new Bot(token);

const webAppUrl = process.env.NEXT_PUBLIC_WEB_APP_URL;
if (!webAppUrl) throw new Error("WEB_APP_URL is unset");

const buyEsimButton = (lang: string = "en") => {
	return new InlineKeyboard().webApp(l("bot_btn_open", lang), webAppUrl);
};

const subscribeToChannelButton = () => {
	return new InlineKeyboard().url(
		"Subscribe to our channels",
		"https://t.me/esim4u"
	);
};

export const getPhotoUrlFromFileId = async (fileId: string) => {
	try {
		const file = await bot.api.getFile(fileId);
		if (!file) return null;

		return `https://api.telegram.org/file/bot${process.env.NEXT_PUBLIC_BOT_TOKEN}/${file?.file_path}`;
	} catch {
		return null;
	}
};

export const sendPhotoToUser = async (
	chatId: number,
	photoUrl: string,
	caption: string
) => {
	await bot.api.sendPhoto(chatId, new InputFile(new URL(photoUrl)), {
		caption: caption,
	});
};

export const sendMessagesToUser = async (
	chatId: number,
	message: string,
	iccid?: string
) => {
	const checkEsimButton = new InlineKeyboard().webApp(
		"Check your esim state at your profile",
		webAppUrl + "/profile?iccid=" + iccid
	);

	await bot.api.sendMessage(chatId, message, {
		parse_mode: "Markdown",
		disable_notification: true,
		reply_markup: checkEsimButton,
	});
};

export const sendMessageToMultipleUsers = async ({
	chatIds,
	message,
	image_url,
	match_query,
	custom_button_url,
	custom_button_title,
}: {
	chatIds: number[];
	message: string;
	image_url?: string;
	match_query?: string;

	custom_button_url?: string;
	custom_button_title?: string;
}) => {
	let buttonToSend;
	if (custom_button_url) {
		buttonToSend = new InlineKeyboard().url(
			custom_button_title || l("bot_btn_open"),
			custom_button_url
		);
	} else {
		buttonToSend = new InlineKeyboard().webApp(
			l("bot_btn_open"),
			webAppUrl + `?${match_query}`
		);
	}

	for (const chatId of chatIds) {
		if (image_url) {
			await bot.api.sendPhoto(chatId, new InputFile(new URL(image_url)), {
				caption: message,
				reply_markup: buttonToSend,
			});
		} else {
			await bot.api.sendMessage(chatId, message, {
				reply_markup: buttonToSend,
			});
		}
	}
};

export const sendWelcomeMessageToUser = async (chatId: number) => {
	const subscribeAwardImage = new InputFile(
		new URL(
			process.env.NEXT_PUBLIC_WEB_APP_URL + "/img/subscribe-award.png"
		)
	);

	if (subscribeAwardImage) {
		await bot.api.sendPhoto(chatId, subscribeAwardImage, {
			caption:
				"🌟 Support Our App and Enjoy Rewards! 🌟\nClick to subscribe to our channel and get 3 months of Telegram Premium for FREE! 🎁✨",
			disable_notification: true,
			reply_markup: subscribeToChannelButton(),
		});
	} else {
		await bot.api.sendMessage(chatId, l("bot_welcome_text"), {
			disable_notification: true,
			reply_markup: buyEsimButton(),
		});
	}

	await updateUserPhoto(chatId);
};

export const updateUserPhoto = async (chatId: number) => {
	const chat = await bot.api.getChat(chatId);
	if (!chat.photo) return;

	await userService.addUserPhotoFileId(
		chat.id,
		chat.username || "",
		chat.photo.small_file_id
	);
};
