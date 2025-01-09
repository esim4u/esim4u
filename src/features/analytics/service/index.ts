"use server";

import supabase from "@/lib/supabase";

export async function getNewUsersAmount(hours = 24) {
	const twentyFourHoursAgo = new Date(
		new Date().getTime() - hours * 60 * 60 * 1000
	).toISOString();

	const users = await supabase
		.from("users")
		.select("id", { count: "exact" })
		.gte("created_date", twentyFourHoursAgo);

	if (users.error) {
		throw new Error("An error occurred while fetching users");
	}

	const totalUsersCount = await supabase
		.from("users")
		.select("id", { count: "exact" });

	if (totalUsersCount.error) {
		throw new Error("An error occurred while fetching total user count");
	}

	return {
		newUsersAmount: users.count,
		totalUsersAmount: totalUsersCount.count,
	};
}
