"use client";

import React from "react";
import { useTelegram } from "@/providers/telegram-provider";
import { PiShareFatFill } from "react-icons/pi";

import { copyText, getReferralLink, hapticFeedback } from "@/lib/utils";
import dynamic from "next/dynamic";
const Qr = dynamic(() => import("../ui/qr"), {
    ssr: false,
    loading: () => <>Loading...</>,
});

type Props = {
    showShareButton?: boolean;
};

const RefLinkQr = ({ showShareButton }: Props) => {
    const { user: tgUser, webApp } = useTelegram();

    return (
        <div className="relative flex flex-col items-center justify-center">
            <Qr
                className="w-64 h-64"
                onClick={() => {
                    hapticFeedback("success");
                    copyText(getReferralLink(tgUser?.id));
                }}
                url={getReferralLink(tgUser?.id)}
            />
            {!!showShareButton && (
                <a
                    onClick={() => {
                        hapticFeedback("success");
                    }}
                    className="bg-white aspect-square p-2 rounded-xl absolute -right-12 text-blue-500 underline"
                    href={`https://t.me/share/url?url=${getReferralLink(
                        tgUser?.id
                    )}&text=Join%20me%20on%20this%20app%20and%20get%20bonuses%20for%20your%20purchases!`}
                >
                    <PiShareFatFill className="w-5 h-5" />
                </a>
            )}
        </div>
    );
};

export default RefLinkQr;
