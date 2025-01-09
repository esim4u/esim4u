import { clientEnvs } from "@/env/client";
import { l } from "@/features/locale/lib/locale";
import userService from "@/features/users/services/user.service";

import {
	Bot,
	GrammyError,
	HttpError,
	InlineKeyboard,
	Keyboard,
	webhookCallback,
} from "grammy";

const BOT_TOKEN = clientEnvs.NEXT_PUBLIC_BOT_TOKEN;
if (!BOT_TOKEN) throw new Error("BOT_TOKEN is unset");

const WEB_APP_URL = clientEnvs.NEXT_PUBLIC_TELEGRAM_WEB_APP_URL;
if (!WEB_APP_URL) throw new Error("WEB_APP_URL is unset");

const bot = new Bot(BOT_TOKEN);

const buyEsimButton = (lang: string = "en") => {
	return new InlineKeyboard().url(l("bot_btn_open", lang), WEB_APP_URL);
};

/////////////////////

const addExternalAd = async (ctx: any) => {
	if (!ctx.match) return;

	//if match is string not number
	if (isNaN(ctx.match)) {
		await userService.addExternalAdUser(
			ctx.chat.id,
			ctx.chat.username,
			ctx.match
		);
	}
};

const addReferrer = async (ctx: any) => {
	if (!ctx.match) return;

	await userService.addReferrerToUser(
		ctx.chat.id,
		ctx.chat.username,
		ctx.match
	);
};

const addUserPhoto = async (ctx: any) => {
	const chat = await ctx.getChat();
	if (!chat.photo) return;

	await userService.addUserPhotoFileId(
		chat.id,
		chat.username,
		chat.photo.small_file_id
	);
};

bot.api.setMyCommands([
	{
		command: "start",
		description: "Start the bot",
	},
	{
		command: "id",
		description:
			"Get your chat ID. With this id our support team can help you if you have any purchase issues",
	},
	{
		command: "rate",
		description: "Rate our bot. We would love to hear your feedback!",
	},
]);

bot.command("start", async (ctx) => {
	await addExternalAd(ctx);
	await addReferrer(ctx);
	await addUserPhoto(ctx);
	await ctx.react("👍");
	await ctx.reply(l("bot_welcome_text", ctx.from?.language_code), {
		reply_markup: buyEsimButton(ctx.from?.language_code),
	});
});

bot.command("rate", async (ctx) => {
	const ratings = [
		{
			label: "I like it!👍",
		},
		{
			label: "It's really bad👎",
		},
	];
	const rows = ratings.map((rate) => {
		return [Keyboard.text(rate.label)];
	});
	const keyboard = Keyboard.from(rows).resized();

	await ctx.reply("Rate our bot. We would love to hear your feedback!", {
		reply_markup: keyboard,
	});
});

bot.hears(["I like it!👍", "It's really bad👎"], async (ctx) => {
	return await ctx.reply(
		"We really appreciate your feedback! Can you please tell us what will make the bot better?",
		{
			reply_markup: { remove_keyboard: true },
		}
	);
});

bot.command("id", async (ctx) => {
	await ctx.reply("Your chat ID is: " + ctx.chat.id);
});

bot.catch((err) => {
	const ctx = err.ctx;
	console.error(`Error while processing update ${ctx.update.update_id}:`);

	const e = err.error;

	if (e instanceof GrammyError) {
		console.error(`Error in request: ${e.description}`);
	} else if (e instanceof HttpError) {
		console.error(`HTTP error: ${e}`);
	} else {
		console.error(`Unknown error: ${e}`);
	}
});

/////////////////////

export const maxDuration = 50;
export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;
export const fetchCache = "force-no-store";

export const POST = webhookCallback(bot, "std/http");
