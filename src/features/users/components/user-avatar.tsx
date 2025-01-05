import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {
	photoUrl: string;
	firstName: string;
	className?: string;
};

const UserAvatar = ({ photoUrl, firstName, className }: Props) => {
	return (
		<Avatar className={cn(className)}>
			<AvatarImage
				src={photoUrl || "/img/default-user.png"}
				alt="@shadcn"
			/>
			<AvatarFallback className=" bg-neutral-500 text-white">
				{firstName && firstName[0]}
			</AvatarFallback>
		</Avatar>
	);
};

export default UserAvatar;
