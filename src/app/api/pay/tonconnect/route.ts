import { TRANSACTION_STATUS } from "@/enums";
import { sendMessagesToUser, sendPhotoToUser } from "@/services/grammy";
import { supabase } from "@/services/supabase";
import { sendAdminTgLog } from "@/services/tg-logger";
import axios from "axios";

import { l } from "@/lib/locale";

export async function POST(req: Request) {
    const { order_id, boc } = await req.json();

    const order = await supabase.from("orders").select("*").eq("id", order_id);

    if (order.error || !order.data.length) {
        return Response.json({ error: "Order not found" });
    }

    await supabase
        .from("orders")
        .update({ status: "PENDING" })
        .eq("id", order_id)
        .eq("status", "CREATED")
        .select();

    const transaction = await supabase
        .from("transactions")
        .select("*")
        .eq("id", order.data[0].transaction_id);

    if (transaction.error || !transaction.data.length) {
        return Response.json({ error: "Transation not found" });
    }

    await supabase
        .from("transactions")
        .update({
            boc: boc,
            status: TRANSACTION_STATUS.SUCCESS,
            amount: order.data[0].price.total_ton,
            currency: "TON",
            merchant: "TONCONNECT",
        })
        .eq("id", order.data[0].transaction_id);

    const users = await supabase
        .from("users")
        .select("*")
        .eq("telegram_id", order.data[0].telegram_id);

    if (users.error || !users.data.length) {
        return Response.json({ error: "User not found" });
    }
    await sendAdminTgLog(
        `🎯${order.data[0].type} order №${order.data[0].id} is purchased! \n\nUsername: @${users.data[0].username} \nCoverage: ${order.data[0].coverage} \n\nTransaction ID: ${order.data[0].transaction_id}\nAmount: ${order.data[0].price.total_ton} TON\nMerchant: Tonconnect\n`,
    );

    if (order.data[0].type == "ESIM") {
        const response = await axios
            .post(
                process.env.AIRALO_API_URL + "/v1/orders",
                {
                    package_id: order.data[0].package_id,
                    quantity: 1,
                },
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${process.env.AIRALO_BUSINESS_ACCESS_TOKEN}`,
                    },
                },
            )
            .then((res) => res.data)
            .catch((e) => e.response);

        if (response.error || response.status >= 400) {
            return Response.json(response.error);
        }

        const airaloEsimData = await axios
            .get(
                process.env.AIRALO_API_URL +
                    `/v2/sims/${response.data.sims[0].iccid}`,
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${process.env.AIRALO_BUSINESS_ACCESS_TOKEN}`,
                    },
                },
            )
            .then((res) => res.data)
            .catch((e) => e.response);

        const esim = await supabase
            .from("orders")
            .update({
                iccid: response.data.sims[0].iccid,
                status: "SUCCESS",
                qrcode_url: response.data.sims[0].qrcode_url,
                sm_dp: airaloEsimData?.data?.lpa,
                confirmation_code: airaloEsimData?.data?.matching_id,
            })
            .eq("id", order.data[0].id)
            .select();

        if (esim.error || !esim.data.length) {
            return Response.json(esim.error);
        }

        try {
            await sendPhotoToUser(
                esim.data[0].telegram_id,
                esim.data[0].qrcode_url,
                l("bot_instruction_qr"),
            );

            const message = `${l("bot_instruction_1")}: \`${esim.data[0].sm_dp}\` \n\n${l(
                "bot_instruction_2",
            )}: \`${esim.data[0].confirmation_code}\` \n\n ${l(
                "bot_instruction_3",
            )}`;
            await sendMessagesToUser(
                esim.data[0].telegram_id,
                message,
                esim.data[0].iccid,
            );
        } catch (e) {
            console.error(e);
            return Response.json(e);
        }

        const resp = await axios
            .get(`/api/esims/sync/` + response.data.sims[0].iccid)
            .then((res) => res.data)
            .catch((e) => e.response);

        return Response.json(esim);
    } else if (order.data[0].type == "TOPUP") {
        const response = await axios
            .post(
                process.env.AIRALO_API_URL + "/v2/orders/topups",
                {
                    package_id: order.data[0].package_id,
                    iccid: order.data[0].iccid,
                    description: "Topup for " + order.data[0].iccid,
                },
                {
                    headers: {
                        Accept: "application/json",
                        Authorization: `Bearer ${process.env.AIRALO_BUSINESS_ACCESS_TOKEN}`,
                    },
                },
            )
            .then((res) => res.data)
            .catch((e) => e.response);

        if (response.error || response.status >= 400) {
            return Response.json(response.error);
        }

        const topup = await supabase
            .from("orders")
            .update({
                status: "SUCCESS",
            })
            .eq("id", order.data[0].id)
            .select();

        const resp = await axios
            .get(`/api/esims/sync/` + order.data[0].iccid)
            .then((res) => res.data)
            .catch((e) => e.response);

        return Response.json(topup);
    }
}
