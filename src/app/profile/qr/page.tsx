"use client";

import QrCode from "@/components/ui/qr-code";
import { getReferralLink } from "@/lib/utils";
import { useTelegram } from "@/providers/telegram-provider";
import React from "react";

type Props = {};

const page = (props: Props) => {
    const { user: tgUser, webApp } = useTelegram();

    return (
        <div className="w-full h-dvh flex flex-col items-center justify-center gap-5 p-5">
            <div>
                <QrCode
                    url={getReferralLink(tgUser?.id)}
                    shareMethod="qr"
                    shareText="Join me on this app and get bonuses for your purchases!"
                    allowCopy
                />
            </div>
            <div>
                <h2 className="text-center font-bold text-lg text-balance px-5">
                    Share this link with your friends to get bonuses for their
                    purchases!
                </h2>
            </div>
        </div>
    );
};

export default page;
