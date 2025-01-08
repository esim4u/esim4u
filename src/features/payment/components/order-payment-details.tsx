import { TonIcon } from "@/components/icons";
import Dot from "@/components/ui/dot";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import React from "react";

type Props = {
	order: any;
	isPending: boolean;
	amountInTon: number;
};

const OrderPaymentDetails = ({ order, isPending, amountInTon }: Props) => {
	if (isPending) {
		return (
			<div className="flex h-12 w-full items-center justify-between rounded-xl bg-white px-4 py-3">
				<div className="flex items-center gap-2 text-sm">
					<Skeleton className=" h-6 w-9"></Skeleton>
					<Skeleton className=" h-5 w-28"></Skeleton>
				</div>
				<Skeleton className=" h-5 w-20"></Skeleton>
			</div>
		);
	}

	return (
		<div className="flex h-12 w-full items-center justify-between rounded-xl bg-white px-4 py-3">
			<div className="flex items-center gap-1 text-sm">
				<Image
					className="  overflow-hidden rounded-md object-contain"
					src={order?.image_url || ""}
					width={32}
					height={32}
					alt="country"
				/>

				<span className="">
					{order?.type == "TOPUP" ? "Topup" : order?.coverage}{" "}
					<span className="text-xs">|</span> {order?.data}{" "}
					<span className="text-xs">|</span> {order?.validity} days
				</span>
			</div>

			<div className="flex items-center gap-1">
				<h2 className="font-bold">
					{order?.price?.total}
					<span className=" text-sm">$</span>
				</h2>
				<Dot className="h-1.5 w-1.5" />
				<h2 className="flex items-center font-bold">
					{amountInTon}
					<TonIcon className="h-3 w-3 " />
				</h2>
			</div>
		</div>
	);
};

export default OrderPaymentDetails;
