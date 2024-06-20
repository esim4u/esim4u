import { Bot, InlineKeyboard, InputFile } from "grammy";

import { l } from "@/lib/locale";

import { addUserPhotoFileId } from "./supabase";

const token = process.env.NEXT_PUBLIC_BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is unset");
const bot = new Bot(token);

const webAppUrl = process.env.NEXT_PUBLIC_WEB_APP_URL;
if (!webAppUrl) throw new Error("WEB_APP_URL is unset");

const buyEsimButton = (lang: string = "en") => {
    return new InlineKeyboard().webApp(l("bot_btn_open", lang), webAppUrl);
};

const subscribeToChannelButton = (lang: string = "en") => {
    return new InlineKeyboard().url(
        "Subscribe to our channels",
        "https://t.me/esim4u",
    );
};

export const getPhotoUrlFromFileId = async (fileId: string) => {
    try {
        const file = await bot.api.getFile(fileId);
        if (!file) return null;

        return `https://api.telegram.org/file/bot${process.env.NEXT_PUBLIC_BOT_TOKEN}/${file?.file_path}`;
    } catch (error) {
        return null;
    }
};

export const sendPhotoToUser = async (
    chatId: number,
    photoUrl: string,
    caption: string,
) => {
    await bot.api.sendPhoto(chatId, new InputFile(new URL(photoUrl)), {
        caption: caption,
    });
};

export const sendMessagesToUser = async (
    chatId: number,
    message: string,
    iccid?: string,
) => {
    const checkEsimButton = new InlineKeyboard().webApp(
        "Check your esim state at your profile",
        webAppUrl + "/profile?iccid=" + iccid,
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
}: {
    chatIds: number[];
    message: string;
    image_url?: string;
    match_query?: string;
}) => {
    const buyEsimButtonWithParam = new InlineKeyboard().webApp(
        l("bot_btn_open"),
        webAppUrl + `?${match_query}`,
    );

    for (const chatId of chatIds) {
        if (image_url) {
            await bot.api.sendPhoto(chatId, new InputFile(new URL(image_url)), {
                caption: message,
                reply_markup: buyEsimButtonWithParam,
            });
        } else {
            await bot.api.sendMessage(chatId, message, {
                reply_markup: buyEsimButtonWithParam,
            });
        }
    }
};

export const sendWelcomeMessageToUser = async (chatId: number) => {
    const subscribeAwardImage = new InputFile(
        new URL(process.env.NEXT_PUBLIC_WEB_APP_URL +"/img/subscribe-award.png"),
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

    await addUserPhotoFileId(chat.id, chat.username, chat.photo.small_file_id);
};
