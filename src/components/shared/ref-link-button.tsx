"use client";

import React from "react";

import { cn, copyReferralLinkToClipBoard } from "@/lib/utils";
import { l } from "@/features/locale/lib/locale";
import { AiFillFire } from "react-icons/ai";
import { useTgUser } from "@/hooks/use-telegram";
import { Button } from "../ui/button";

type Props = {
	className?: string;
};

const RefLinkButton = ({ className }: Props) => {
	const { tgUser } = useTgUser();

	return (
		<Button
			variant={"unstyled"}
            size={"fit"}
			onClick={() => copyReferralLinkToClipBoard(tgUser?.id || "")}
			className={cn(
				"flex h-10 min-w-32 cursor-pointer items-center gap-1 rounded-full bg-white p-2 pr-3 transition-transform active:scale-95",
				className
			)}
		>
			<AiFillFire className=" text-redish !size-5" />

			<div className=" flex flex-col">
				<span className="text-center  text-[10px] font-semibold leading-3">
					{l("btn_top_share")}
				</span>
				<span className="text-center text-[9px] leading-[10px] text-neutral-500">
					{l("btn_top_share_subtitle")}
				</span>
			</div>
		</Button>
	);
};

export default RefLinkButton;
