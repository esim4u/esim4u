"use client";

import { VisaIcon } from "@/components/icons";
import MastercardIcon from "@/components/icons/mastercard-icon";
import { Button } from "@/components/ui/button";
import Collapse from "@/components/ui/collapse";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaApplePay } from "react-icons/fa";
import { MdArrowForwardIos } from "react-icons/md";

const CardPayment = ({ order }: { order: any }) => {
	const router = useRouter();

	const [isCardPaymentOpen, setIsCardPaymentOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (order && order.checkout_id) {
			setIsLoading(true);
			(window as any).SumUpCard?.mount({
				id: "sumup-card",
				checkoutId: order.checkout_id,
				showFooter: false,
				onResponse: async function (type: any, body: any) {
					if (type == "success" && body && body.status == "PAID") {
						router.push("/payment/success?order_id=" + order.id);
					} else if (body && body.status == "FAILED") {
						toast({
							variant: "destructive",
							title: "Error. Payment failed.",
						});
					} else {
						console.log(type, body);
					}
				},
				onLoad: function () {
					setTimeout(() => {
						setIsLoading(false);
					}, 1000);
				},
			});
		}
	}, [order]);

	return (
		<div className="w-full rounded-2xl bg-white">
			<div
				className="z-10 flex w-full cursor-pointer items-center justify-between px-6 py-2"
				onClick={() => {
					setIsCardPaymentOpen(!isCardPaymentOpen);
				}}
			>
				<h2 className="flex cursor-pointer items-center gap-2 text-xs font-medium uppercase text-neutral-500">
					<VisaIcon className="size-10" />
					<MastercardIcon className="size-6" />
					<FaApplePay className="mx-1 h-10 w-10 text-black" />
				</h2>
				<MdArrowForwardIos
					className={cn(
						"text-neutral-500 transition-transform",
						isCardPaymentOpen && " rotate-90"
					)}
				/>
			</div>
			<Collapse isOpen={isCardPaymentOpen}>
				<div className={cn("-mt-14")}>
					<CardPaymentSkeleton isLoading={isLoading} />
					<div
						className={cn(isLoading && "hidden")}
						id="sumup-card"
					></div>
					<div className="p-6 pt-0">
						<Button
							onClick={() => {
								router.push(
									"/payment/success?order_id=" + order.id
								);
							}}
							className="w-full rounded-xl"
						>
							Test Redirect to success page
						</Button>
					</div>
				</div>
			</Collapse>
		</div>
	);
};

const CardPaymentSkeleton = ({ isLoading }: { isLoading: boolean }) => {
	return (
		<div
			className={cn(
				" flex h-[450px] w-full flex-col justify-between gap-2 rounded-2xl p-6 pt-16",
				!isLoading && "hidden"
			)}
		>
			<div className="flex flex-col gap-2">
				<Skeleton className="h-4 w-full"></Skeleton>
				<Skeleton className="h-4 w-full"></Skeleton>
				<Skeleton className="h-10 w-full"></Skeleton>
				<Skeleton className="h-4 w-full"></Skeleton>
				<Skeleton className="h-10 w-full"></Skeleton>
				<Skeleton className="h-10 w-full"></Skeleton>
				<Skeleton className="h-4 w-full"></Skeleton>
				<Skeleton className="h-10 w-full"></Skeleton>
			</div>
			<Skeleton className="h-10 w-full"></Skeleton>
		</div>
	);
};

export default CardPayment;
