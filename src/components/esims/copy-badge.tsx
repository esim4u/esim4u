import { copyText, hapticFeedback } from "@/lib/utils";
import React from "react";
import { TbCopy } from "react-icons/tb";

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
            className="flex items-center gap-1"
        >
            {!!text && (
                <h2 className="px-2 h-7 flex items-center bg-white rounded-md">
                    {text}
                </h2>
            )}
            <div className="bg-white h-7 w-7 flex items-center justify-center rounded-md">
                <TbCopy />
            </div>
        </div>
    );
};

export default CopyBadge;
