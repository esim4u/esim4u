"use server";

import { TRANSACTION_STATUS } from "@/features/payment/enums";
import supabase from "@/lib/supabase";

export const getTransactionByStripeId = async (stripe_id: string) => {
	const transactions = await supabase
		.from("transactions")
		.select(`*`)
		.eq("stripe_id", stripe_id)
		.eq("status", TRANSACTION_STATUS.CREATED)
		.limit(1);

	if (transactions.error || transactions.data.length === 0) {
		throw new Error("Transaction not found");
	}

	return transactions.data[0];
};

export const updateTransactionStatus = async (
	transaction_id: string | number,
	status: TRANSACTION_STATUS
) => {
	const updatedTransaction = await supabase
		.from("transactions")
		.update({ status })
		.eq("id", transaction_id)
		.select();

	if (updatedTransaction.error || updatedTransaction.data.length === 0) {
		throw new Error("Failed to update transaction status");
	}

	return updatedTransaction.data[0];
};
