import axios from "axios";

const TG_LOGGER_BOT_TOKEN = process.env.NEXT_PUBLIC_TG_LOGGER_BOT_TOKEN;

const members = [473700512];

export const sendTgLog = async (message: string) => {
    members.forEach(async (chat_id) => {
        await axios
            .get(
                `https://api.telegram.org/bot${TG_LOGGER_BOT_TOKEN}/sendMessage?chat_id=${chat_id}&text=${encodeURI(
                    message,
                )}&parse_mode=html`,
            )
            .catch((e) => {});
    });
};
