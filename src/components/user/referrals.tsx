"use client";

import Image from "next/image";
import { useTelegram } from "@/providers/telegram-provider";
import { getUserReferrals } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";

import { l } from "@/lib/locale";
import { cn, hapticFeedback } from "@/lib/utils";

import { TonIcon } from "../icons";
import PremiumIcon from "../icons/premium-icon";

interface Props {
    hideTitle?: boolean;
    className?: string;
}

const Referrals = ({ hideTitle, className }: Props) => {
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
            <div className={cn(" w-full", className)}>
                <div className="relative flex h-[180px] w-full flex-col items-center justify-center gap-2 rounded-3xl bg-white">
                    {!hideTitle && (
                        <div
                            className={cn(
                                "absolute left-4 top-4 flex  items-center gap-2 font-medium uppercase text-neutral-500",
                            )}
                        >
                            <h2>{l("title_frens")}</h2>{" "}
                        </div>
                    )}
                    <div className="mt-1 flex flex-col items-center justify-center gap-2">
                        <div className="flex flex-col items-center justify-between gap-2 px-5 text-center">
                            <p className="text-pretty font-semibold leading-4">
                                Invite frens and start earning money!
                            </p>
                            <div className="flex gap-1 text-sm font-semibold text-amber-500">
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
        <div className="flex w-full flex-col gap-2">
            {!hideTitle && (
                <div className="flex  items-center justify-between gap-2 px-4 font-medium uppercase text-neutral-500">
                    <h2 className="">{l("title_frens")}</h2>
                    <div className="flex size-6 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-center font-bold text-white">
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
                            "https://t.me/" + referral.username,
                        );
                    }}
                    className="flex h-10 cursor-pointer items-center justify-between rounded-2xl bg-white p-4 transition-transform active:scale-95"
                >
                    <span className="font-medium text-blue-500">
                        @{referral.username}
                    </span>
                    <div className=" grid w-40 grid-cols-5 gap-1 ">
                        <div className=" col-span-2 -mr-4 flex items-center justify-center">
                            <span className="  flex min-w-9 items-center justify-center rounded-md  bg-gradient-to-r from-violet-500 to-purple-500 px-1 font-medium text-white">
                                {!!referral.orders[0].count &&
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

export default Referrals;
