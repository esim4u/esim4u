import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getCreatedOrderById, getOrderById } from "../services/order";
import { getStripePaymentIntent } from "../services/stripe";

const REFETCH_INTERVAL = 1000 * 10; // 10 seconds

export function useGetCreatedOrderById(order_id: string | number) {
	return useQuery({
		queryKey: ["created-order", order_id],
		queryFn: async () => {
			return await getCreatedOrderById(order_id);
		},
		placeholderData: keepPreviousData,
		enabled: !!order_id,
		refetchInterval: REFETCH_INTERVAL,
	});
}

export function useGetOrderById(order_id: string | number | null | undefined) {
	return useQuery({
		queryKey: ["order", order_id],
		queryFn: async () => {
			if (!order_id) {
				throw new Error("Order ID is required");
			}
			return await getOrderById(order_id);
		},
		placeholderData: keepPreviousData,
		enabled: !!order_id,
		refetchInterval: REFETCH_INTERVAL,
	});
}

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
