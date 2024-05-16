import { Bot } from "grammy";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is unset");
const bot = new Bot(token);

export const getPhotoUrlFromFileId = async (fileId: string) => {
    const file = await bot.api.getFile(fileId);
    if (!file) return "No file found";
    
    return `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file?.file_path}`;
};
