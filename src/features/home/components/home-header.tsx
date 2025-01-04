"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { GrTrophy } from "react-icons/gr";
import { MdArrowForwardIos } from "react-icons/md";

import { useTgUser } from "@/hooks/use-telegram";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useGetUserById } from "@/features/users/hooks/use-users";
import RefLinkButton from "@/components/shared/ref-link-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const HomeHeader = ({ className }: { className?: string }) => {
	const router = useRouter();

	const { tgUser } = useTgUser();
	const { data: dbUserData } = useGetUserById(tgUser?.id);

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
					<Avatar>
						<AvatarImage
							src={
								tgUser?.photoUrl ||
								dbUserData?.photo_url ||
								"/img/default-user.png"
							}
							alt="@shadcn"
						/>
						<AvatarFallback className=" bg-neutral-500 text-white">
							{tgUser?.firstName ? tgUser?.firstName[0] : "U"}
						</AvatarFallback>
					</Avatar>
					<div className="flex flex-col gap-1">
						<div className="flex h-3 items-center gap-1 font-medium text-neutral-500">
							<p className="max-w-20 overflow-hidden text-ellipsis  text-xs">
								{tgUser?.username
									? `@${tgUser?.username}`
									: "@user"}
							</p>
							<MdArrowForwardIos className="h-[14px] w-[14px]" />
						</div>

						<Badge size={"sm"}>
							{dbUserData?.badge || "New user"}
						</Badge>
					</div>
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
