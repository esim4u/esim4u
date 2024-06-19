import { l } from "@/lib/locale";
import {
    addExternalAdUser,
    addReferrerToUser,
    addUserPhotoFileId,
} from "@/services/supabase";
import { sendTgLog } from "@/services/tg-logger";
import {
    Bot,
    InlineKeyboard,
    GrammyError,
    HttpError,
    Keyboard,
    webhookCallback,
    InputFile,
} from "grammy";

const token = process.env.NEXT_PUBLIC_BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is unset");
const bot = new Bot(token);

const webAppUrl = process.env.NEXT_PUBLIC_WEB_APP_URL;
if (!webAppUrl) throw new Error("WEB_APP_URL is unset");

const buyEsimButton = (lang:string) =>{
    return new InlineKeyboard().webApp(l("bot_btn_open", lang), webAppUrl);
}
// const buyEsimButton = new InlineKeyboard().webApp(l("bot_btn_open"), webAppUrl);
// const loginEsimButton = new InlineKeyboard().login("Login", webAppUrl)

/////////////////////

const addExternalAd = async (ctx: any) => {
    console.log(ctx)
    await sendTgLog("CTX" + JSON.stringify(ctx, null, 2))
    
    if (!ctx.match) return;
    
    //if match is string not number
    if (isNaN(ctx.match)) {
        console.log(ctx.chat)
        await sendTgLog("CTX CHAT" + JSON.stringify(ctx.chat, null, 2))
        await addExternalAdUser(ctx.chat.id, ctx.chat.username, ctx.match);
    }
};

const addReferrer = async (ctx: any) => {
    if (!ctx.match) return;

    await addReferrerToUser(ctx.chat.id, ctx.chat.username, ctx.match);
};

const addUserPhoto = async (ctx: any) => {
    const chat = await ctx.getChat();
    if (!chat.photo) return;

    await addUserPhotoFileId(chat.id, chat.username, chat.photo.small_file_id);
};

bot.api.setMyCommands([
    {
        command: "start",
        description: "Start the bot",
    },
    {
        command: "esim",
        description:
            "You can buy esims from all across the world with this bot! Just click the button below to buy an esim plan!",
    },
    {
        command: "id",
        description:
            "Get your chat ID. With this id our support team can help you if you have any purchase issues",
    },
    // {
    //     command: "getavatar",
    //     description: "Get your user profile picture",
    // },
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
    await ctx.reply(l("bot_welcome_text"), {
        reply_markup: buyEsimButton(ctx.from?.language_code || "en"),
    });
});

bot.command("esim", async (ctx) => {
    await addUserPhoto(ctx);
    await ctx.reply(
        "You can buy esims from all across the world with this bot! Just click the button below to buy an esim plan!",
        {
            reply_markup: buyEsimButton(ctx.from?.language_code || "en"),
        }
    );
});

// bot.command("getavatar", async (ctx) => {
//     const chat = await ctx.getChat();
//     if (!chat.photo) return await ctx.reply("You have no profile picture");

//     const file = await ctx.api.getFile(chat.photo.small_file_id);
//     const fileUrl = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

//     await ctx.replyWithPhoto(new InputFile(new URL(fileUrl)), {
//         caption: `File ID: ${chat.photo.small_file_id}`,
//     });
// });

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

bot.on("::url", async (ctx) => {
    await ctx.reply("You sent me a URL: " + ctx.message?.text);
});

// bot.on("message", async (ctx) => {
//     const url = await getPhotoUrlFromFileId(ctx.message?.text || "");
//     await ctx.reply(url);
// });

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
