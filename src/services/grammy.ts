import { Bot, InputFile } from "grammy";

const token = process.env.NEXT_PUBLIC_BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is unset");
const bot = new Bot(token);

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
    await bot.api.sendMessage(chatId, message, { parse_mode: "Markdown"} );
};
