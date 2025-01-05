import { cn } from "@/lib/utils";
import React from "react";
import { IoIosInformationCircleOutline } from "react-icons/io";

type Props = {
	className?: string;
};

const OneTimeInstallationWarningBanner = ({ className }: Props) => {
	return (
		<div
			className={cn(
				"flex flex-col gap-2 rounded-2xl bg-redish p-4 text-white",
				className
			)}
		>
			<div className="flex items-center gap-1.5">
				<IoIosInformationCircleOutline className="size-5" />
				<h2 className="text-xl font-bold">One-time installation</h2>
			</div>
			<p className="text-sm font-medium leading-4">
				Once you remove an ESIM from your device, you might not be able
				to reinstall it.
			</p>
		</div>
	);
};

export default OneTimeInstallationWarningBanner;
