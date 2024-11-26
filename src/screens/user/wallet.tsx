"use client";

import React, { useMemo } from "react";
import { useRouter } from "next/navigation";
import gemSpinAnim from "@/assets/anim/gem.json";
import { getWalletByUserId, setWalletAutoWithdraw } from "@/services/supabase";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Lottie from "lottie-react";
import { BsArrowDownCircleFill } from "react-icons/bs";
import { IoMdTime } from "react-icons/io";

import { l } from "@/lib/locale";
import {
    autoWithdrawWarningToast,
    cn,
    withdrawAmountWarningToast,
} from "@/lib/utils";
import { useTelegram } from "@/hooks/use-telegram";

import { Switch } from "@/components/ui/switch";
import { TonIcon } from "@/components/icons";
import Referrals from "@/components/user/referrals";

type Props = {};

const Wallet = (props: Props) => {
    const router = useRouter();
    const { tgUser } = useTelegram();

    const { data: rateTonUsd } = useQuery({
        queryKey: ["ratetonusd"],
        queryFn: async () => {
            const { data } = await axios.get(
                "https://tonapi.io/v2/rates?tokens=ton&currencies=usd",
            );
            return data.rates.TON.prices.USD;
        },
        refetchInterval: 1000 * 10, // 10 sec
    });

    const { data: walletData, refetch: refetchWalletData } = useQuery({
        queryKey: ["wallet", tgUser?.id],
        queryFn: async () => {
            const data = await getWalletByUserId(tgUser?.id);
            return data;
        },
        placeholderData: keepPreviousData,
        refetchInterval: 1000 * 10, // 10 sec
    });

    const setAutoWithdraw = useMutation({
        mutationFn: async (autoWithdraw: boolean) => {
            await setWalletAutoWithdraw(tgUser?.id, autoWithdraw);
        },
        onSettled: () => {
            refetchWalletData();
        },
    });

    const amountInUsd = useMemo(() => {
        if (!walletData || !rateTonUsd) return 0;
        const res = walletData.amount * rateTonUsd;
        return +res.toFixed(2);
    }, [walletData, rateTonUsd]);

    return (
        <div className="flex h-dvh w-full flex-col items-center gap-5 p-5">
            <div className="flex flex-col items-center justify-center  ">
                <div className="relative flex h-16 w-20 items-center justify-center">
                    <Lottie
                        className="absolute h-32 w-32"
                        animationData={gemSpinAnim}
                    />
                </div>

                {/* <FaRegGem className="h-12 w-12 text-neutral-700" /> */}
                <div className="flex flex-col items-center justify-center ">
                    <h2 className=" text-center text-[28px] font-bold text-neutral-700 first-letter:uppercase">
                        {l("wallet_rewards_title")}
                    </h2>
                    <pre className=" text-balance text-center font-sans font-medium leading-5 text-neutral-600/90">
                        {l("wallet_rewards_subtitle_1")} 0.2 TON ≈ $
                        {(rateTonUsd * 0.2).toFixed(2)}
                        {l("wallet_rewards_subtitle_2")}
                    </pre>
                </div>
            </div>
            <div className="flex w-full flex-col justify-center gap-2 rounded-3xl bg-white p-4 shadow-lg">
                <h2 className="text-center font-medium capitalize text-neutral-600/90">
                    {l("wallet_balance_title")}
                </h2>
                <div className="flex flex-col">
                    <div className="flex items-center justify-center gap-1 text-neutral-700">
                        <span className="text-[40px] font-bold leading-10">
                            {walletData?.amount}
                        </span>{" "}
                        <TonIcon className="-mt-0.5 h-7 w-7" />
                    </div>
                    <div className="flex items-center justify-center gap-1 text-center text-3xl  text-neutral-600/60">
                        <span>≈</span>
                        <span className="font-semibold">{amountInUsd}$</span>
                    </div>
                </div>
            </div>
            <div className="flex w-full items-center justify-between">
                <button
                    onClick={() => {
                        if (walletData?.amount < 10) {
                            withdrawAmountWarningToast();
                        } else if (walletData?.auto_withdraw) {
                            autoWithdrawWarningToast();
                        } else {
                            alert("Withdraw");
                        }
                    }}
                    className={cn(
                        "flex items-center gap-2 rounded-[14px] bg-white px-4 py-2 text-neutral-700 shadow-lg active:scale-95",
                        (walletData?.amount < 10 ||
                            walletData?.auto_withdraw) &&
                            " text-neutral-500/50",
                    )}
                >
                    <BsArrowDownCircleFill className="h-5 w-5" />
                    <span className=" text-xs font-bold uppercase">
                        {l("btn_withdraw")}
                    </span>
                </button>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-medium text-neutral-700 first-letter:uppercase">
                        {l("wallet_autowithdraw_text")}
                    </span>
                    <div className="flex items-center gap-1">
                        <Switch
                            checked={walletData?.auto_withdraw}
                            onCheckedChange={(checked) => {
                                setAutoWithdraw.mutate(checked);
                            }}
                            id="auto-withdraw"
                        />
                        <IoMdTime className="h-7 w-7 text-neutral-500" />
                    </div>
                </div>
            </div>
            <Referrals hideTitle />
        </div>
    );
};

export default Wallet;
