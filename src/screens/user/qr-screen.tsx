"use client";

import { getReferralLink } from "@/lib/utils";
import { useTelegram } from "@/hooks/use-telegram";

import QrCode from "@/components/ui/qr-code";

const QrScreen = () => {
    const { tgUser } = useTelegram();

    return (
        <div className="flex h-dvh w-full flex-col items-center justify-center gap-5 p-5">
            <div>
                <QrCode
                    url={getReferralLink(tgUser?.id || "")}
                    shareMethod="url"
                    shareText="Join me on this app and get bonuses for your purchases!"
                    allowCopy
                />
            </div>
            <div>
                <h2 className="text-balance px-5 text-center text-lg font-bold">
                    Share this link with your friends to get bonuses for their
                    purchases!
                </h2>
            </div>
        </div>
    );
};

export default QrScreen;
