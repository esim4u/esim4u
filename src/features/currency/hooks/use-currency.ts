import { useQuery } from "@tanstack/react-query";
import {
	convertUsdToPreferredCurrency,
	getTonUsdRate,
} from "../services/currency";

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

export function useGetConvertedAmount({
	currency_code,
	amount,
}: {
	currency_code: string;
	amount: number;
}) {
	return useQuery({
		queryKey: ["converted-amount", currency_code, amount],
		queryFn: async () => {
			return await convertUsdToPreferredCurrency({
				currency_code,
				amount,
			});
		},
	});
}
