import { useQuery } from "@tanstack/react-query";
import { getLeaderboard } from "../service";

export function useGetLeaderboard() {
	return useQuery({
		queryKey: ["leaderboard"],
		queryFn: async () => {
			const data = await getLeaderboard();

			return data;
		},
	});
}
