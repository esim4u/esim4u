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

const ADMIN_TG_LOGGER_BOT_TOKEN = process.env.NEXT_PUBLIC_ADMIN_BOT_TOKEN;
const admins = [473700512, 258793];

export const sendAdminTgLog = async (message: string) => {
    admins.forEach(async (chat_id) => {
        await axios
            .get(
                `https://api.telegram.org/bot${ADMIN_TG_LOGGER_BOT_TOKEN}/sendMessage?chat_id=${chat_id}&text=${encodeURI(
                    message,
                )}&parse_mode=html`,
            )
            .catch((e) => {});
    });
};
