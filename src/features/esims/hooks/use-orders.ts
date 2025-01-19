import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import {
	createEsimOrder,
	createTopupOrder,
	getCreatedOrderById,
	getOrderById,
} from "../../esims/services/order";
import { NewEsimOrderData, NewTopupOrderData } from "@/features/esims/types";

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

export function useCreateEsimOrder() {
	return useMutation({
		mutationFn: async (data: NewEsimOrderData) => {
			return await createEsimOrder(data);
		},
		onError: (error) => {},
		onSuccess: (data) => {
			return data;
		},
	});
}

export function useCreateTopupOrder() {
	return useMutation({
		mutationFn: async (data: NewTopupOrderData) => {
			return await createTopupOrder(data);
		},
		onError: (error) => {},
		onSuccess: (data) => {
			return data;
		},
	});
}
