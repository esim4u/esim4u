"use client";

import React, { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTelegram } from "@/providers/telegram-provider";
import { BsArrowDownCircleFill } from "react-icons/bs";
import { FaRegGem } from "react-icons/fa";
import { IoMdTime } from "react-icons/io";
import { RiHistoryFill } from "react-icons/ri";

import { l } from "@/lib/locale";
import { hapticFeedback } from "@/lib/utils";

import { Switch } from "@/components/ui/switch";
import { TonIcon } from "@/components/icons";
import ReferralList from "@/components/shared/referral-list";
import Referrals from "@/components/user/referrals";

type Props = {};

const Wallet = (props: Props) => {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();

    useEffect(() => {
        if (webApp) {
            webApp?.BackButton.show();
            webApp?.MainButton.setParams({
                text: l("btn_main_share"),
                color: "#3b82f6",
                is_active: true,
                is_visible: true,
            });
        }
    }, [webApp]);

    useEffect(() => {
        webApp?.onEvent("backButtonClicked", goBack);
        return () => {
            webApp?.offEvent("backButtonClicked", goBack);
        };
    }, [webApp]);

    const goBack = useCallback(() => {
        hapticFeedback("heavy");
        router.back();
    }, [webApp]);

    return (
        <div className="flex h-dvh w-full flex-col items-center gap-5 p-5">
            <div className="flex flex-col items-center justify-center  ">
                <FaRegGem className="h-12 w-12 text-neutral-700" />
                <div className="flex flex-col items-center justify-center ">
                    <h2 className=" text-center text-[28px] font-bold text-neutral-700 first-letter:uppercase">
                        {l("wallet_rewards_title")}
                    </h2>
                    <p className="text-balance text-center font-medium leading-5 text-neutral-600/90">
                        {l("wallet_rewards_subtitle")}
                    </p>
                </div>
            </div>
            <div className="flex w-full flex-col justify-center gap-2 rounded-3xl bg-white p-4 shadow-lg">
                <h2 className="text-center font-medium capitalize text-neutral-600/90">
                    {l("wallet_balance_title")}
                </h2>
                <div className="flex flex-col">
                    <div className="flex items-center justify-center gap-1 text-neutral-700">
                        <span className="text-[40px] font-bold leading-10">
                            {12.04}
                        </span>{" "}
                        <TonIcon className="-mt-0.5 h-7 w-7" />
                    </div>
                    <div className="flex items-center justify-center gap-1 text-center text-3xl  text-neutral-600/60">
                        <span>≈</span>
                        <span className="font-semibold">{96}$</span>
                    </div>
                </div>
            </div>
            <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-2 rounded-[14px] bg-white px-4 py-2 text-neutral-700 shadow-lg">
                    <BsArrowDownCircleFill className="h-5 w-5" />
                    <span className=" text-xs font-bold uppercase">
                        {l("btn_withdraw")}
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-neutral-700 first-letter:uppercase">
                        {l("wallet_autowithdraw_text")}
                    </span>
                    <div className="flex items-center gap-1">
                        <Switch
                            onCheckedChange={() => {
                                hapticFeedback("success");
                            }}
                            id="auto-withdraw"
                        />
                        <IoMdTime className="h-7 w-7 text-neutral-500" />
                    </div>
                </div>
            </div>
            <Referrals hideTitle/>
        </div>
    );
};

export default Wallet;
