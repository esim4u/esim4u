import { createCheckout } from "@/services/sumup";
import { supabase } from "@/services/supabase";
import { ceil, floor } from "@/lib/utils";
import axios from "axios";
import { sendTgLog } from "@/services/tg-logger";
import { sendMessagesToUser, sendPhotoToUser } from "@/services/grammy";

export async function POST(req: Request) {
    const { id, status, event_type } = await req.json();

    if (status == "FAILED") {
        return Response.json({ status });
    }

    let transaction = await supabase
        .from("transactions")
        .select("*")
        .eq("checkout_id", id)
        .eq("status", "CREATED");

    if (transaction.error || !transaction.data.length) {
        return Response.json({ error: "Transaction not found" });
    }

    await supabase
        .from("transactions")
        .update({ status: "SUCCESS" })
        .eq("id", transaction.data[0].id);

    const order = await supabase
        .from("orders")
        .update({ status: "PENDING" })
        .eq("transaction_id", transaction.data[0].id)
        .eq("status", "CREATED")
        .select();

    if (order.error || !order.data.length) {
        return Response.json({ error: "Order not found" });
    }

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
            }
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
            }
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

    await sendPhotoToUser(
        esim.data[0].telegram_id,
        esim.data[0].qrcode_url,
        "Scan qr for quick setup"
    );

    await sendMessagesToUser(
        esim.data[0].telegram_id,
        `SM-DP+ Address: \`${esim.data[0].sm_dp}\` \n\nYour Activation code code is: \`${esim.data[0].confirmation_code}\``
    );

    return Response.json(esim);
}
