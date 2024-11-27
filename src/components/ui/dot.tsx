"use client";
import { cn } from "@/lib/utils";

type Props = {
	className?: string;
};

const Dot = ({ className }: Props) => {
	return (
		<div className={cn("bg-black size-2 rounded-full", className)}></div>
	);
};

export default Dot;
