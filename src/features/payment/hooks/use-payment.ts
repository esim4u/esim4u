import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getStripePaymentIntent } from "../services/stripe";

const REFETCH_INTERVAL = 1000 * 10; // 10 seconds

export function useGetStripePaymentIntent(pi: string | null | undefined) {
	return useQuery({
		queryKey: ["stripe-payment-intent", pi],
		queryFn: async () => {
			if (!pi) {
				throw new Error("Payment Intent ID is required");
			}
			return await getStripePaymentIntent(pi);
		},
		placeholderData: keepPreviousData,
		enabled: !!pi,
		refetchInterval: REFETCH_INTERVAL,
	});
}
