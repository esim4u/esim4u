import { useQuery } from "@tanstack/react-query";
import { getTonUsdRate } from "../services/currency";

const REFETCH_INTERVAL = 1000 * 10; // 10 sec

export function useGetTonUsdRate() {
	return useQuery({
		queryKey: ["ratetonusd"],
		queryFn: async () => {
			return getTonUsdRate();
		},
		refetchInterval: REFETCH_INTERVAL,
	});
}
