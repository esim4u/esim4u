"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CardCollapse from "./card-collapse";

const SumupPayment = ({ order }: { order: any }) => {
	const router = useRouter();
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
						router.push(`/payment/success?order_id=` + order.id);
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
		<CardCollapse>
			<div className={cn("-mt-14")}>
				<SumupPaymentSkeleton isLoading={isLoading} />
				<div
					className={cn(isLoading && "hidden")}
					id="sumup-card"
				></div>
			</div>
		</CardCollapse>
	);
};

const SumupPaymentSkeleton = ({ isLoading }: { isLoading: boolean }) => {
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

export default SumupPayment;
