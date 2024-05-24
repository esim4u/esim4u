"use client";

import React, { useRef } from "react";
import { useTelegram } from "@/providers/telegram-provider";
import { PiShareFatFill } from "react-icons/pi";

import { cn, copyText, getReferralLink, hapticFeedback } from "@/lib/utils";
import dynamic from "next/dynamic";
const Qr = dynamic(() => import("./qr"), {
    ssr: false,
    loading: () => <>Loading...</>,
});

type Props = {
    url: string;
    shareMethod?: "none" | "qr" | "url" | "both";
    shareText?: string;
    allowCopy?: boolean;
};

const QrCode = ({
    url,
    shareMethod = "none",
    shareText,
    allowCopy = false,
}: Props) => {
    const qrRef = useRef(null);

    return (
        <div className="relative flex flex-col items-center justify-center">
            <Qr
                className={cn("w-64 h-64", allowCopy && " cursor-pointer")}
                onClick={() => {
                    if (!allowCopy) return;
                    hapticFeedback("success");
                    copyText(url);
                }}
                url={url}
            />
            <ShareButton
                url={url}
                shareText={shareText}
                shareMethod={shareMethod}
            />
        </div>
    );
};

export default QrCode;

const ShareButton = ({
    url,
    shareMethod,
    shareText,
}: {
    url: string;
    shareMethod: string;
    shareText?: string;
}) => {
    if (shareMethod === "url") {
        return (
            <a
                onClick={() => {
                    hapticFeedback("success");
                }}
                className="bg-white aspect-square p-2 rounded-xl absolute -right-12 text-blue-500 underline"
                href={`https://t.me/share/url?url=${url}&text=${
                    shareText || ""
                }`}
            >
                <PiShareFatFill className="w-5 h-5" />
            </a>
        );
    }

    if (shareMethod === "qr") {
        return (
            <button
                onClick={() => {
                    hapticFeedback("success");
                }}
                className="bg-white aspect-square p-2 rounded-xl absolute -right-12 text-blue-500 underline"
            >
                <PiShareFatFill className="w-5 h-5" />
            </button>
        );
    }
};
