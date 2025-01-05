import { useTgUser } from "@/hooks/use-telegram";
import React from "react";
import UserAvatar from "./user-avatar";
import { useGetUserById } from "../hooks/use-users";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MdArrowForwardIos } from "react-icons/md";

type Props = {
	orientation?: "horizontal" | "vertical";
	size?: "sm" | "md";
	avatarRing?: boolean;
	arrowIcon?: boolean;
};

const UserBlock = ({
	size = "sm",
	orientation = "horizontal",
	avatarRing = true,
	arrowIcon = true,
}: Props) => {
	const { tgUser } = useTgUser();
	const { data: dbUserData } = useGetUserById(tgUser?.id);

	return (
		<div
			className={cn(
				"flex flex-col pt-2 gap-2 items-center",
				orientation == "horizontal" ? "flex-row" : "flex-col gap-3"
			)}
		>
			<UserAvatar
				photoUrl={tgUser?.photoUrl || ""}
				firstName={tgUser?.firstName || ""}
				className={cn(
					size == "sm" && "ring-[2px] ring-offset-1",
					size == "md" && "h-32 w-32 ring-[3px] ring-offset-2",
					avatarRing ? "ring-neutral-500/30" : "ring-transparent"
				)}
			/>
			<div
				className={cn(
					"flex flex-col gap-1",
					orientation == "vertical" && "items-center"
				)}
			>
				<div className="flex items-center gap-1 text-neutral-500">
					<p
						className={cn(
							"overflow-hidden text-ellipsis",
                            size == "sm" && "text-xs max-w-20 ",
                            size == "md" && "text-base max-w-44  font-medium leading-4"
						)}
					>
						{tgUser?.username ? `@${tgUser?.username}` : "@user"}
					</p>
					{arrowIcon && (
						<MdArrowForwardIos className="h-[14px] w-[14px]" />
					)}
				</div>

				<Badge size={size}>{dbUserData?.badge}</Badge>
			</div>
		</div>
	);
};

export default UserBlock;
