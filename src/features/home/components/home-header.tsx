"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { GrTrophy } from "react-icons/gr";

import RefLinkButton from "@/components/shared/ref-link-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import UserBlock from "@/features/users/components/user-block";

const HomeHeader = ({ className }: { className?: string }) => {
	const router = useRouter();

	return (
		<section className={cn("w-full", className)}>
			<div className="flex w-full items-center justify-between gap-5">
				<Button
					variant={"unstyled"}
					size={"fit"}
					onClick={() => {
						router.push("/profile");
					}}
					className="flex cursor-pointer items-center  gap-2 transition-transform active:scale-95"
				>
					<UserBlock />
				</Button>

				<div className="flex items-center gap-2 ">
					<RefLinkButton />
					<Button
						variant={"unstyled"}
						size={"fit"}
						onClick={() => {
							router.push("/leaderboard");
						}}
						className="flex size-10 min-w-10 items-center justify-center rounded-full bg-white active:scale-95"
					>
						<GrTrophy className=" text-amber-500 " />
					</Button>
				</div>
			</div>
		</section>
	);
};

export default HomeHeader;
