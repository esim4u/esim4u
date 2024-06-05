"use client";

import { l } from "@/lib/locale";
import { cn, copyText, hapticFeedback } from "@/lib/utils";
import { useTelegram } from "@/providers/telegram-provider";
import { getUserReferrals } from "@/services/supabase";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { BiPurchaseTagAlt } from "react-icons/bi";
import RefLinkButton from "../shared/ref-link-button";
import Image from "next/image";
import { TonIcon } from "../icons";
import PremiumIcon from "../icons/premium-icon";

interface Props {
    hideTitle?: boolean;
}

const Referrals = ({ hideTitle }: Props) => {
    const { user: tgUser, webApp } = useTelegram();

    const { data: referrals, isLoading } = useQuery({
        queryKey: ["referrals", tgUser?.id],
        queryFn: async () => {
            const data = await getUserReferrals(tgUser.id);
            return data;
        },
    });

    if (referrals?.length === 0) {
        return (
            <div className=" w-full">
                <div className="relative flex flex-col items-center justify-center gap-2 bg-white rounded-3xl h-[180px] w-full">
                    {!hideTitle && (
                        <div
                            className={cn(
                                "absolute left-4 top-4 flex  gap-2 uppercase items-center font-medium text-neutral-500"
                            )}
                        >
                            <h2>{l("title_frens")}</h2>{" "}
                        </div>
                    )}
                    <div className="flex flex-col gap-2 mt-1 items-center justify-center">
                        <div className="flex flex-col gap-2 items-center justify-between text-center px-5">
                            <p className="font-semibold text-pretty leading-4">
                                Invite frens and start earning money!
                            </p>
                            <div className="flex gap-1 text-amber-500 text-sm font-semibold">
                                Just click the button below{" "}
                                <Image
                                    src="/img/icons/hand-down.png"
                                    alt="Hand down emoji icon"
                                    width={14}
                                    height={14}
                                    className="object-cover"
                                />
                            </div>
                            {/* <RefLinkButton className="shadow-lg" /> */}
                        </div>
                        {/* <h2 className="text-center font-medium text-3xl text-neutral-300">
                            NO FRENS YET
                        </h2> */}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            {!hideTitle && (
                <div className="flex  gap-2 uppercase justify-between items-center px-4 font-medium text-neutral-500">
                    <h2 className="">{l("title_frens")}</h2>
                    <div className="bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center text-center text-white rounded-full font-bold size-6">
                        <span className="">{referrals?.length}</span>
                    </div>
                </div>
            )}
            
            {referrals?.map((referral: any, index: number) => (
                <div
                    key={referral.telegram_id}
                    onClick={() => {
                        hapticFeedback();
                        webApp?.openTelegramLink(
                            "https://t.me/" + referral.username
                        );
                    }}
                    className="cursor-pointer active:scale-95 transition-transform flex items-center justify-between bg-white h-10 p-4 rounded-2xl"
                >
                    <span className="text-blue-500 font-medium">
                        @{referral.username}
                    </span>
                    <div className=" grid grid-cols-5 gap-1 w-40 ">
                        <div className=" col-span-2 flex items-center justify-center -mr-4">
                            <span className="  flex items-center min-w-9 px-1 justify-center  font-medium bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-md">
                                {!!referral.orders[0].count &&
                                    referral.orders[0].count}
                            </span>
                        </div>
                        <div className="col-span-2  flex items-center justify-center">
                            <span className=" flex items-center text-purple-500 font-semibold">
                                {0.0}
                                <TonIcon className="w-4 h-4 ml-1" />
                            </span>
                        </div>

                        <div className="col-span-1  flex items-center justify-center">
                            {referral.is_premium && (
                                <PremiumIcon className="w-6 h-6" />
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Referrals;
