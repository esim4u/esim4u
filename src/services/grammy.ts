import { Bot, InlineKeyboard, InputFile } from "grammy";
import { addUserPhotoFileId } from "./supabase";
import { l } from "@/lib/locale";

const token = process.env.NEXT_PUBLIC_BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is unset");
const bot = new Bot(token);

const webAppUrl = process.env.NEXT_PUBLIC_WEB_APP_URL;
if (!webAppUrl) throw new Error("WEB_APP_URL is unset");

const buyEsimButton = new InlineKeyboard().webApp(l("bot_btn_open"), webAppUrl);

export const getPhotoUrlFromFileId = async (fileId: string) => {
    const file = await bot.api.getFile(fileId);
    if (!file) return "No file found";

    return `https://api.telegram.org/file/bot${process.env.NEXT_PUBLIC_BOT_TOKEN}/${file?.file_path}`;
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

export const sendMessagesToUser = async (chatId: number, message: string) => {
    await bot.api.sendMessage(chatId, message, { parse_mode: "Markdown" });
};

export const sendWelcomeMessageToUser = async (chatId: number) => {
    await bot.api.sendMessage(
        chatId,
        "Hello! This is Esim4U bot. With this bot you can easily buy esim plans all across the world!",
        {
            disable_notification: true,
            reply_markup: buyEsimButton,
        }
    );

    await updateUserPhoto(chatId);
};

export const updateUserPhoto = async (chatId: number) => {
    const chat = await bot.api.getChat(chatId);
    if (!chat.photo) return;

    await addUserPhotoFileId(chat.id, chat.username, chat.photo.small_file_id);
};
