"use client";

import React, { useEffect, useRef } from "react";

type QrProps = {
    url: string;
    className?: string;
    onClick?: () => void;
};

import QRCodeStyling from "qr-code-styling";
import { cn } from "@/lib/utils";

const qrCode = new QRCodeStyling({
    width: 384,
    height: 384,
    image: "",
    type: "canvas",
    margin: 22,
    qrOptions: {
        typeNumber: 0,
        mode: "Byte",
        errorCorrectionLevel: "H",
    },
    imageOptions: {
        hideBackgroundDots: true,
        imageSize: 1,
        margin: 10,
        crossOrigin: "anonymous",
    },
    dotsOptions: {
        color: "#3b82f6",
        type: "extra-rounded",
    },
    backgroundOptions: {
        color: "#ffffff",
    },
    cornersSquareOptions: {
        color: "#3b82f6",
        type: "extra-rounded",
    },
    cornersDotOptions: {
        color: "#3b82f6",
    },
});

const Qr = ({ url, onClick, className }: QrProps) => {
    const ref = useRef(null);

    useEffect(() => {
        if (!ref.current) return;
        qrCode.append(ref.current);
    }, []);

    useEffect(() => {
        qrCode.update({
            data: url,
        });
    }, [url]);

    return (
        <div
            onClick={onClick}
            className={cn("w-72 h-72 rounded-3xl overflow-hidden", className)}
        >
            <div
                className="w-full  h-full [&_canvas]:w-full [&_canvas]:h-full"
                ref={ref}
            />
        </div>
    );
};

export default Qr;
