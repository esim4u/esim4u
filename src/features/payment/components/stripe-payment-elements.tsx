"use client";

import React from "react";
import {
	Elements,
	ExpressCheckoutElement,
	PaymentElement,
	useElements,
	useStripe,
} from "@stripe/react-stripe-js";
import getStripe from "@/lib/stripe";
import { useGetStripePaymentIntent } from "../hooks/use-payment";
import Stripe from "stripe";
import { Button } from "@/components/ui/button";
import { convertCentsToDollars } from "../lib/utils";
import { toast } from "@/hooks/use-toast";
import CardCollapse, { CardCollapseSkeleton } from "./card-collapse";
import { useRouter } from "next/navigation";
import SpinLoader from "@/components/ui/spin-loader";
import { clientEnvs } from "@/env/client";

const WEB_APP_URL = clientEnvs.NEXT_PUBLIC_WEB_APP_URL;

const StripePaymentElements = ({
	paymentIntentId,
}: {
	paymentIntentId: string | undefined;
}) => {
	const { data: paymentIntent, isPending } =
		useGetStripePaymentIntent(paymentIntentId);

	const stripePromise = getStripe();
	if (isPending) {
		return <CardCollapseSkeleton />;
	}

	if (!paymentIntentId || !paymentIntent || !paymentIntent.client_secret) {
		return null;
	}

	return (
		<Elements
			stripe={stripePromise}
			options={{
				clientSecret: paymentIntent.client_secret,
			}}
		>
			<CardCollapse>
				<StripeCheckoutForm paymentIntent={paymentIntent} />
			</CardCollapse>
		</Elements>
	);
};

export default StripePaymentElements;

const StripeCheckoutForm = ({
	paymentIntent,
}: {
	paymentIntent: Stripe.PaymentIntent;
}) => {
	const [isLoading, setIsLoading] = React.useState(false);
	const router = useRouter();
	const stripe = useStripe();
	const elements = useElements();

	const handleSubmit = async (event: any) => {
		event?.preventDefault();
		setIsLoading(true);

		if (
			!stripe ||
			!elements ||
			!paymentIntent ||
			!paymentIntent.client_secret
		) {
			toast({
				variant: "destructive",
				description: "Stripe not initialized",
			});
			setIsLoading(false);
			return;
		}

		const elementsSubmit = await elements?.submit();
		if (elementsSubmit?.error) {
			toast({
				variant: "destructive",
				description: elementsSubmit.error.message,
			});
			setIsLoading(false);
			return;
		}

		const paymentConfirm = await stripe?.confirmPayment({
			elements: elements!,
			clientSecret: paymentIntent.client_secret,
			confirmParams: {
				return_url: `${WEB_APP_URL}/payment/success?order_id=${paymentIntent.metadata.order_id}`,
			},
		});

		if (paymentConfirm?.error) {
			toast({
				variant: "destructive",
				description: paymentConfirm.error.message,
			});
		} else {
			toast({
				variant: "success",
				description: "Payment confirmed",
			});
			router.push(
				`/payment/success?order_id=${paymentIntent.metadata.order_id}`
			);
		}
		setIsLoading(false);
	};

	return (
		<form
			className="w-full flex flex-col gap-4 p-5 pt-0"
			onSubmit={handleSubmit}
		>
			<ExpressCheckoutElement onConfirm={handleSubmit} />
			<PaymentElement />
			<Button
				disabled={!paymentIntent}
				size={"lg"}
				className="w-full rounded-xl"
				type="submit"
			>
				{isLoading ? (
					<SpinLoader className="size-6" />
				) : (
					`Pay ${convertCentsToDollars(paymentIntent.amount)}$`
				)}
			</Button>
		</form>
	);
};
