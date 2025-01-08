import { cn } from "@/lib/utils";
import React from "react";
import { RiLoader5Fill } from "react-icons/ri";

type Props = {
	className?: string;
};

const SpinLoader = ({ className }: Props) => {
	return <RiLoader5Fill className={cn(" size-5 animate-spin", className)} />;
};

export default SpinLoader;
