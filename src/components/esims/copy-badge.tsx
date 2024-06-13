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
            className="cursor-pointer flex items-center gap-1 justify-between"
        >
            {!!text && (
                <div className="px-2 bg-white h-7  rounded-md flex items-center justify-center w-full ">
                    <h2 className="text-center text-xs">{text}</h2>
                </div>
            )}
            <div className="bg-white size-7 min-w-7 flex items-center justify-center rounded-md">
                <TbCopy />
            </div>
        </div>
    );
};

export default CopyBadge;
