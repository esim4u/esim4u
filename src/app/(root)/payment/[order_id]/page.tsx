"use client";

import { useTgBackButton } from "@/hooks/use-telegram";
import { useParams } from "next/navigation";
import React from "react";

const OrderPaymentPage = () => {
	useTgBackButton();
	const { order_id } = useParams<{ order_id: string }>();

	return (
		<main className="container flex flex-col bg-background gap-2 p-5">
			Payment for order #{order_id}
		</main>
	);
};

export default OrderPaymentPage;
