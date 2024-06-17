"use client";

import React, { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";

import { cn } from "@/lib/utils";

type QrProps = {
    url: string;
    className?: string;
    onClick?: () => void;
};

const Qr = ({ url, onClick, className }: QrProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const qrCode = useRef<QRCodeStyling | null>(null);

    useEffect(() => {
        if (ref.current && !qrCode.current) {
            qrCode.current = new QRCodeStyling({
                width: 384,
                height: 384,
                type: "canvas",
                margin: 20,
                // image: "/svg/telegram-logo.svg",
                // imageOptions: {
                //     hideBackgroundDots: true,
                //     imageSize: 0.4,
                //     margin: 10,
                //     crossOrigin: "anonymous",
                // },
                qrOptions: {
                    typeNumber: 0,
                    mode: "Byte",
                    errorCorrectionLevel: "H",
                },
                dotsOptions: {
                    color: "#000000",
                    type: "extra-rounded",
                },
                backgroundOptions: {
                    color: "#ffffff",
                },
                cornersSquareOptions: {
                    color: "#35495E",
                    type: "extra-rounded",
                },
                cornersDotOptions: {
                    color: "#35495E",
                },
                data: url, // Add data URL here
            });

            qrCode.current.append(ref.current);
        }

        return () => {
            qrCode.current = null;
        };
    }, []);

    useEffect(() => {
        if (qrCode.current) {
            qrCode.current.update({
                data: url,
            });
        }
    }, [url]);

    return (
        <div
            onClick={onClick}
            className={cn("h-72 w-72 overflow-hidden rounded-3xl", className)}
        >
            <div
                className="h-full w-full [&_canvas]:h-full [&_canvas]:w-full"
                ref={ref}
            />
        </div>
    );
};

export default Qr;
