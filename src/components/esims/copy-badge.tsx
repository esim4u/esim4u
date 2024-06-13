import React from "react";
import { TbCopy } from "react-icons/tb";

import { copyText, hapticFeedback } from "@/lib/utils";

type Props = {
    text?: string;
    textToCopy?: string;
};

const CopyBadge = ({ text, textToCopy }: Props) => {
    return (
        <div
            onClick={() => {
                hapticFeedback();
                copyText(textToCopy || text || "");
            }}
            className="flex cursor-pointer items-center justify-between gap-1"
        >
            {!!text && (
                <div className="flex h-7 w-full  items-center justify-center rounded-md bg-white px-2 ">
                    <h2 className="text-center text-xs">{text}</h2>
                </div>
            )}
            <div className="flex size-7 min-w-7 items-center justify-center rounded-md bg-white">
                <TbCopy />
            </div>
        </div>
    );
};

export default CopyBadge;
