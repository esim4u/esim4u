"use client";

import { Button } from "@/components/ui/button";
import { useGetConvertedAmount } from "@/features/currency/hooks/use-currency";
import { useGetCreatedOrderById } from "@/features/esims/hooks/use-orders";
import OrderPaymentDetails from "@/features/payment/components/order-payment-details";
import StripePayment from "@/features/payment/components/stripe-payment-elements";
import { useTgBackButton } from "@/hooks/use-telegram";
import { useParams, useRouter } from "next/navigation";
import React from "react";

const OrderPaymentPage = () => {
	const router = useRouter();
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
			<StripePayment paymentIntentId={order?.stripe_id} />
		</main>
	);
};

export default OrderPaymentPage;
