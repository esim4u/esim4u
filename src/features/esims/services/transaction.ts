"use server";

import supabase from "@/lib/supabase";

export const getTransactionByStripeId = async (stripe_id: string) => {
	const transactions = await supabase
		.from("transactions")
		.select(`*`)
		.eq("stripe_id", stripe_id)
        .limit(1);

	if (transactions.error || transactions.data.length === 0) {
		throw new Error("Transaction not found");
	}

	return transactions.data[0];
};
