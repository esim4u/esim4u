"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTelegram } from "@/providers/telegram-provider";
import {
    getLeaderboard,
    getUserById,
    getUserReferrals,
} from "@/services/supabase";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { FaUserFriends } from "react-icons/fa";
import { GrTrophy } from "react-icons/gr";
import { PiMedalFill } from "react-icons/pi";

import { l } from "@/lib/locale";
import { cn, hapticFeedback } from "@/lib/utils";
import useReferralLink from "@/hooks/useRefLink";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Collapse from "@/components/ui/collapse";
import ReferralList from "@/components/shared/referral-list";
import Referrals from "@/components/user/referrals";

type Props = {};

const PlaceLabel = ({ index }: { index: number }) => {
    if (index === 0) {
        // return <PiMedalFill className=" size-6 text-yellow-500" />;
        // return <PiMedalFill className=" size-6 text-orange-500" />;
        return (
            <PiMedalFill className=" size-6 text-clip text-[#ff9721] drop-shadow-[0_3px_3px_rgba(255,255,255,0.25)] " />
        );
    } else if (index === 1) {
        return (
            <PiMedalFill className=" size-5 text-gray-500 drop-shadow-[0_3px_3px_rgba(255,255,255,0.25)]" />
        );
    } else if (index === 2) {
        return (
            <PiMedalFill className=" size-5 text-amber-700 drop-shadow-[0_3px_3px_rgba(255,255,255,0.25)]" />
        );
    } else {
        return (
            <span className=" font-semibold text-neutral-500">
                {" "}
                {index + 1}
            </span>
        );
    }
};

const LeaderBoard = (props: Props) => {
    const { user: tgUser, webApp } = useTelegram();
    const router = useRouter();
    useReferralLink(webApp, tgUser);

    const { data: leaders, isLoading } = useQuery({
        queryKey: ["leaderboard"],
        queryFn: async () => {
            const data = await getLeaderboard();

            return data;
        },
    });
    const { data: dbUserData } = useQuery({
        queryKey: ["user", tgUser?.id],
        queryFn: async () => {
            const data = await getUserById(tgUser.id);
            return data;
        },
        placeholderData: keepPreviousData,
    });

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
        <main className="flex h-dvh flex-col items-center gap-2 overflow-x-hidden p-5">
            <Banner />
            <div className="flex w-full flex-col items-center gap-2">
                {leaders?.map((leader: any, index: number) => {
                    return (
                        <LeaderBoardUser
                            key={leader.telegram_id}
                            leader={leader}
                            index={index}
                            dbUserData={dbUserData}
                        />
                    );
                })}
            </div>
        </main>
    );
};
const LeaderBoardUser = ({
    leader,
    index,
    dbUserData,
}: {
    leader: any;
    index: number;
    dbUserData: any;
}) => {
    const { user: tgUser, webApp } = useTelegram();
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className={cn("flex w-full flex-col")}>
            <div
                className={cn(
                    "flex items-center gap-2",
                    index == 0 && "z-30 -rotate-[0.75deg]",
                    index == 1 && "z-20 -mt-1 rotate-[0.75deg]",
                    index == 2 && "z-10 -mt-1 -rotate-[0.75deg]",
                )}
            >
                <div
                    key={leader.telegram_id}
                    className={cn(
                        "grid h-11 w-full grid-cols-7 rounded-lg bg-white shadow-lg",
                        tgUser?.id == leader.telegram_id &&
                            " ring-2 ring-purple-500",
                        index == 0 &&
                            " bg-gradient-to-r from-[#FFE142] via-[#fff7cd]  via-40% to-[#FD9B2E] font-semibold text-orange-700/90 ring-1 ring-[#FFE142]",
                        index == 1 &&
                            " bg-gradient-to-r from-zinc-400/90 via-white  via-60% to-zinc-500 font-semibold text-zinc-500 ring-1 ring-zinc-300/50",
                        index == 2 &&
                            " bg-gradient-to-r from-amber-500/70 via-amber-100 via-40%  to-amber-700 font-semibold text-amber-700 ring-1 ring-amber-400/50",
                    )}
                >
                    <div className="col-span-1 flex items-center justify-center">
                        <PlaceLabel index={index} />
                    </div>
                    <div className="col-span-5 flex items-center gap-2">
                        <Avatar className="h-6 w-6 drop-shadow-[0_3px_3px_rgba(255,255,255,0.25)] ">
                            <AvatarImage
                                src={
                                    (tgUser?.id == leader.telegram_id &&
                                        dbUserData?.photo_url) ||
                                    leader?.photo_url ||
                                    `https://api.dicebear.com/8.x/bottts-neutral/svg?seed=${leader.telegram_id}` ||
                                    "/img/default-user.png"
                                }
                                alt="@shadcn"
                            />
                            <AvatarFallback className=" bg-neutral-500 text-white">
                                <span>{leader?.first_name[0]}</span>
                            </AvatarFallback>
                        </Avatar>
                        {dbUserData?.badge.toLowerCase() == "admin" ? (
                            <p
                                onClick={() => {
                                    hapticFeedback();
                                    webApp?.openTelegramLink(
                                        "https://t.me/" + leader.username,
                                    );
                                }}
                                className=" line-clamp-1 w-32 overflow-hidden text-ellipsis"
                            >
                                {leader?.first_name || "Esim4U Fren"}
                            </p>
                        ) : (
                            <p className=" line-clamp-1 w-32 overflow-hidden text-ellipsis">
                                {leader?.first_name || "Esim4U Fren"}
                            </p>
                        )}
                    </div>
                    <div className="col-span-1 flex items-center justify-center ">
                        <span
                            className={cn(
                                " mr-2 flex min-w-9 items-center justify-center rounded-md  bg-gradient-to-r from-violet-500 to-purple-500 px-1 font-medium text-white",
                                index == 0 &&
                                    " bg-gradient-to-r from-[#FFE142] via-[#fff7cd] via-40%  to-[#FD9B2E] font-semibold text-orange-700/90 ring-1 ring-[#FFE142]/75 ",
                                index == 1 &&
                                    " bg-gradient-to-r from-zinc-200 via-white via-60% to-zinc-500 font-semibold text-zinc-500 ring-1 ring-zinc-300",
                                index == 2 &&
                                    " bg-gradient-to-r from-amber-500 via-amber-100 via-40%  to-amber-700 font-semibold text-amber-700 ring-1 ring-amber-400/50",
                            )}
                        >
                            {leader.referrals_count || 0}
                        </span>
                    </div>
                </div>
                {(tgUser?.id == leader.telegram_id ||
                    dbUserData?.badge.toLowerCase() == "admin") && (
                    <Button
                        className={cn(
                            "aspect-square min-w-10 bg-white  text-purple-600 shadow-lg",
                            index == 0 &&
                                " bg-gradient-to-r from-[#FFE142] via-[#fff7cd] via-40% to-[#FD9B2E] font-semibold text-orange-700/90 ring-2 ring-[#FFE142]",
                            index == 1 &&
                                " bg-gradient-to-r from-zinc-200 via-white via-60% to-zinc-500 font-semibold text-zinc-500 ring-2 ring-zinc-300",
                            index == 2 &&
                                " bg-gradient-to-r from-amber-500 via-white via-40%  to-amber-700 font-semibold text-amber-700 ring-2 ring-amber-400/50",
                            isOpen &&
                                " bg-gradient-to-tr from-indigo-500 via-purple-500 via-100% to-purple-500 text-white ring-0",
                        )}
                        onClick={() => {
                            hapticFeedback();
                            setIsOpen(!isOpen);
                        }}
                        variant={"unstyled"}
                        size={"icon"}
                    >
                        <FaUserFriends className=" size-5" />
                    </Button>
                )}
            </div>
            <ReferralCollapse
                isOpen={isOpen}
                telegram_id={leader.telegram_id}
                referrals={leader.referrals}
            />
        </div>
    );
};

const ReferralCollapse = ({
    telegram_id,
    isOpen,
    referrals
}: {
    telegram_id: string;
    isOpen: boolean;
    referrals: any[];
}) => {
    const { data: userReferrals } = useQuery({
        queryKey: ["referrals", telegram_id],
        queryFn: async () => {
            const data = await getUserReferrals(telegram_id);
            return data;
        },
        placeholderData: referrals,
        enabled: isOpen,
    });

    return (
        <Collapse className="" isOpen={isOpen}>
            <div className="mt-2">
                <ReferralList referrals={userReferrals} />
            </div>
        </Collapse>
    );
};

const Banner = () => {
    return (
        <div className="flex w-full items-center justify-between rounded-xl bg-white px-5 py-3">
            <div className="p-2">
                <GrTrophy className=" h-12 w-12 text-amber-500 " />
            </div>

            <div className="flex-1 flex-col">
                <h2 className="text-center font-bold uppercase">
                    invited the most frens
                </h2>
                <p className="text-pretty text-center text-sm leading-4">
                    Invite more frens to get into the leader board!{" "}
                </p>
            </div>
        </div>
    );
};

export default LeaderBoard;
