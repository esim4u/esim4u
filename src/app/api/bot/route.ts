import {
    Bot,
    InlineKeyboard,
    GrammyError,
    HttpError,
    Keyboard,
    webhookCallback,
} from "grammy";

const token = process.env.BOT_TOKEN;
if (!token) throw new Error("BOT_TOKEN is unset");
const bot = new Bot(token);

const webAppUrl = process.env.WEB_APP_URL;
if (!webAppUrl) throw new Error("WEB_APP_URL is unset");

const buyEsimButton = new InlineKeyboard().login("Login", webAppUrl)

/////////////////////

bot.api.setMyCommands([
    {
        command: "start",
        description: "Start the bot",
    },
    {
        command: "buyesim",
        description:
            "You can buy esims from all across the world with this bot! Just click the button below to buy an esim plan!",
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
    await ctx.react("👍");
    await ctx.reply(
        "Hello! This is Esim4U bot. With this bot you can easily buy esim plans all across the world!",
        {
            reply_markup: buyEsimButton,
        }
    );
});

bot.command("buyesim", async (ctx) => {
    await ctx.reply(
        "You can buy esims from all across the world with this bot! Just click the button below to buy an esim plan!",
        {
            reply_markup: buyEsimButton,
        }
    );
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

bot.on("::url", async (ctx) => {
    await ctx.reply("You sent me a URL: " + ctx.message?.text);
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
