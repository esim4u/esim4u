import { completeEsimOrderByTransactionId } from "@/features/esims/services/order";
import {
	getTransactionByStripeId,
	updateTransactionStatus,
} from "@/features/esims/services/transaction";
import { l } from "@/features/locale/lib/locale";
import { TRANSACTION_STATUS } from "@/features/payment/enums";
import { sendMessagesToUser, sendPhotoToUser } from "@/lib/grammy";
import { sendTgLog } from "@/lib/tg-logger";
import { after } from "next/server";

export async function POST(req: Request) {
	const body = await req.json();
	const { id: eventId, type, object, data } = body;

	const paymentData = data.object;

	// Wait until the Telegram message is sent + not blocking the response
	after(sendTgLog(JSON.stringify(body, null, 2)));

	if (object != "event") {
		return Response.json(
			{
				message: "Not a valid Stripe event",
			},
			{ status: 400 }
		);
	}

	if (!paymentData || !paymentData.id) {
		return Response.json(
			{
				message: "No payment data found",
			},
			{ status: 400 }
		);
	}

	if (type == "payment_intent.succeeded") {
		const transaction = await getTransactionByStripeId(paymentData.id);
		if (!transaction || !transaction.id) {
			return Response.json(
				{
					message: "Transaction not found",
				},
				{ status: 400 }
			);
		}

		const updatedTransaction = await updateTransactionStatus(
			transaction.id,
			TRANSACTION_STATUS.SUCCESS
		);
		if (!updatedTransaction || !updatedTransaction.id) {
			return Response.json(
				{
					message: "Failed to update transaction status",
				},
				{ status: 400 }
			);
		}

		const { order, boughtEsim } = await completeEsimOrderByTransactionId(
			transaction.id
		);
		if (!boughtEsim) {
			return Response.json(
				{
					message: "Failed to complete the order",
				},
				{ status: 400 }
			);
		}

		try {
			await sendPhotoToUser(
				order.telegram_id,
				boughtEsim.qrcode_url,
				l("bot_instruction_qr")
			);

			const message = `${l("bot_instruction_1")}: \`${
				boughtEsim.sm_dp
			}\` \n\n${l("bot_instruction_2")}: \`${
				boughtEsim.confirmation_code
			}\` \n\n ${l("bot_instruction_3")}`;

			await sendMessagesToUser(
				order.telegram_id,
				message,
				boughtEsim.iccid
			);
		} catch (e) {
			console.error(e);
			return Response.json(e);
		}

		return Response.json(
			{
				message: "Successfully completed the order",
			},
			{ status: 200 }
		);
	}

	return Response.json(
		{
			message: "Successfully logged the webhook event",
		},
		{ status: 200 }
	);
}
