"use client";

import { useGetConvertedAmount } from "@/features/currency/hooks/use-currency";
import CardPayment from "@/features/payment/components/card-payment";
import OrderPaymentDetails from "@/features/payment/components/order-payment-details";
import { useGetCreatedOrderById } from "@/features/payment/hooks/use-payment";
import { useTgBackButton } from "@/hooks/use-telegram";
import { useParams } from "next/navigation";
import React from "react";

const OrderPaymentPage = () => {
	useTgBackButton();
	const { order_id } = useParams<{ order_id: string }>();

	const { data: order, isPending } = useGetCreatedOrderById(order_id);

	const { data: amountInTon } = useGetConvertedAmount({
		currency_code: "ton",
		amount: order?.price?.total,
	});

	return (
		<main className="container flex flex-col bg-background gap-2 p-5">
			<OrderPaymentDetails
				order={order}
				isPending={isPending}
				amountInTon={+(amountInTon?.amount || 0)}
			/>
			<CardPayment order={order} />
		</main>
	);
};

export default OrderPaymentPage;
