"use client";

import React, { useRef } from "react";
import dynamic from "next/dynamic";
import { PiShareFatFill } from "react-icons/pi";

import { cn, copyText, hapticFeedback } from "@/lib/utils";

const Qr = dynamic(() => import("./qr"), {
    ssr: false,
    loading: () => (
        <div className="h-64 w-64 animate-pulse rounded-xl bg-white/25"></div>
    ),
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
                className={cn(
                    "h-64 w-64",
                    "bg-white/25",
                    allowCopy && " cursor-pointer",
                )}
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
                className="absolute -right-12 aspect-square rounded-xl bg-white p-2 text-blue-500 underline"
                href={`https://t.me/share/url?url=${url}&text=${
                    shareText || ""
                }`}
            >
                <PiShareFatFill className="h-5 w-5" />
            </a>
        );
    }

    if (shareMethod === "qr") {
        return (
            <button
                onClick={() => {
                    hapticFeedback("success");
                }}
                className="absolute -right-12 aspect-square rounded-xl bg-white p-2 text-blue-500 underline"
            >
                <PiShareFatFill className="h-5 w-5" />
            </button>
        );
    }
};
