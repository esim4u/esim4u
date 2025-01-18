import { VisaIcon } from "@/components/icons";
import MastercardIcon from "@/components/icons/mastercard-icon";
import { Button } from "@/components/ui/button";
import Collapse from "@/components/ui/collapse";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { FaApplePay } from "react-icons/fa";
import { MdArrowForwardIos } from "react-icons/md";

type Props = {
	children: React.ReactNode;
};

const CardCollapse = ({ children }: Props) => {
	const [isCardPaymentOpen, setIsCardPaymentOpen] = useState(false);

	return (
		<div className="w-full rounded-2xl bg-white">
			<Button
				variant={"unstyled"}
				size={"fit"}
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
			</Button>
			<Collapse isOpen={isCardPaymentOpen}>{children}</Collapse>
		</div>
	);
};

export const CardCollapseSkeleton = () => {
	return <Skeleton className="w-full h-14 rounded-xl"></Skeleton>;
};

export default CardCollapse;
