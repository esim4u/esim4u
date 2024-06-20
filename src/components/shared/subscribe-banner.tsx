"use client";

import React from "react";
import Image from "next/image";
import { useTelegram } from "@/providers/telegram-provider";

import { cn, hapticFeedback } from "@/lib/utils";

type Props = {
    className?: string;
};

const SubscribeBanner = ({ className }: Props) => {
    const { webApp } = useTelegram();
    return (
        <div
            onClick={() => {
                hapticFeedback("success");
                webApp?.openTelegramLink("https://t.me/esim4travel");
            }}
            className={cn(
                " animated-background rounded-3xl bg-gradient-to-tr from-red-400 via-purple-500 to-sky-400 p-[3px]  transition-transform active:scale-95",
                className,
            )}
        >
            <div
                className={cn(
                    "flex items-center rounded-[21px] bg-white px-3 py-3",
                )}
            >
                <div className="flex min-h-14 min-w-14 items-center justify-center">
                    <Image
                        src="/logo-glow.png"
                        alt="Subscribe banner"
                        width={56}
                        height={56}
                    />
                </div>
                <div>
                    <h2 className=" text-center text-[15px] font-semibold tracking-tighter	">
                        🌟 Support Our App and Enjoy Rewards! 🌟
                    </h2>
                    <p className="text-center text-xs tracking-tighter leading-[14px]">
                        Click to subscribe to our channel and get 3 months of{" "}
                        <b>Telegram Premium for FREE!</b> 🎁✨
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SubscribeBanner;
