import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getUserEsims } from "../services/esims";

const REFETCH_INTERVAL = 1000 * 60 * 1; // 1 minutes

export function useGetUserEsims(telegram_id: number) {
	return useQuery({
		queryKey: ["user-esims", telegram_id],
		queryFn: async () => {
			return await getUserEsims(telegram_id);
		},
		placeholderData: keepPreviousData,
		enabled: !!telegram_id,
		refetchInterval: REFETCH_INTERVAL,
	});
}
