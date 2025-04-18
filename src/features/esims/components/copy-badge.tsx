import { Button } from "@/components/ui/button";
import { copyText } from "@/lib/utils";
import React from "react";
import { TbCopy } from "react-icons/tb";

type Props = {
	text?: string;
	textToCopy?: string;
};

const CopyBadge = ({ text, textToCopy }: Props) => {
	return (
		<Button
			variant={"unstyled"}
			size={"fit"}
			onClick={() => {
				copyText(textToCopy || text || "");
			}}
			className="flex cursor-pointer items-center justify-between gap-1 w-full"
		>
			{!!text && (
				<div className="flex h-7 w-full  items-center justify-center rounded-md bg-white px-2 ">
					<h2 className="text-center max-w-56 truncate shrink text-xs">{text}</h2>
				</div>
			)}
			<div className="flex size-7 min-w-7 items-center justify-center rounded-md bg-white">
				<TbCopy />
			</div>
		</Button>
	);
};

export default CopyBadge;
