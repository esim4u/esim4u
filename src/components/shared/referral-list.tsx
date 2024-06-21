import { hapticFeedback } from "@/lib/utils";
import React from "react";
import { TonIcon, PremiumIcon } from "../icons";
import { useTelegram } from "@/providers/telegram-provider";

type Props = {
    referrals: any;
};

const ReferralList = ({ referrals }: Props) => {
    const { webApp } = useTelegram();
    return (
        <div className="flex w-full flex-col gap-1">
            {referrals?.map((referral: any, index: number) => (
                <div
                    key={referral.telegram_id}
                    onClick={() => {
                        hapticFeedback();
                        webApp?.openTelegramLink(
                            "https://t.me/" + referral.username,
                        );
                    }}
                    className="flex h-10 cursor-pointer items-center justify-between rounded-lg bg-white p-4 transition-transform active:scale-95"
                >
                    <span className="font-medium text-blue-500 truncate max-w-28">
                        @{referral.username}
                    </span>
                    <div className=" grid w-40 grid-cols-5 gap-1 ">
                        <div className=" col-span-2 -mr-4 flex items-center justify-center">
                            <span className="  flex min-w-9 items-center justify-center rounded-md  bg-gradient-to-r from-violet-500 to-purple-500 px-1 font-medium text-white">
                                {!!referral.orders &&
                                    referral.orders[0].count}
                            </span>
                        </div>
                        <div className="col-span-2  flex items-center justify-center">
                            <span className=" flex items-center font-semibold text-purple-500">
                                {0.0}
                                <TonIcon className="ml-1 h-4 w-4" />
                            </span>
                        </div>

                        <div className="col-span-1  flex items-center justify-center">
                            {referral.is_premium && (
                                <PremiumIcon className="h-6 w-6" />
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ReferralList;
