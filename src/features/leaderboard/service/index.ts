import supabase from "@/lib/supabase";

export const getLeaderboard = async (limit = 20, offset = 0) => {
	const users = await supabase.rpc("get_leaderboard_v4", {
		p_limit: limit,
		p_offset: offset,
	});

	return users.data || [];
};
