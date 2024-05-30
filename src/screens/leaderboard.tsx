"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { l } from "@/lib/locale";
import { cn, copyText, getReferralLink, hapticFeedback } from "@/lib/utils";
import { useTelegram } from "@/providers/telegram-provider";
import { getPhotoUrlFromFileId } from "@/services/grammy";
import { getLeaderboard, getUserById } from "@/services/supabase";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import React, { useCallback, useEffect } from "react";
import { GrTrophy } from "react-icons/gr";
import { PiMedalFill } from "react-icons/pi";

type Props = {};

const PlaceLabel = ({ index }: { index: number }) => {
    if (index === 0) {
        return <PiMedalFill className=" size-6 text-yellow-500" />;
    } else if (index === 1) {
        return <PiMedalFill className=" size-5 text-gray-500" />;
    } else if (index === 2) {
        return <PiMedalFill className=" size-5 text-yellow-800" />;
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

    const copyReferralLink = useCallback(() => {
        if (webApp) {
            hapticFeedback();
            copyText(
                getReferralLink(webApp?.initDataUnsafe?.user?.id.toString())
            );
        }
    }, [webApp]);

    useEffect(() => {
        webApp?.onEvent("mainButtonClicked", copyReferralLink);
        return () => {
            webApp?.offEvent("mainButtonClicked", copyReferralLink);
        };
    }, [webApp]);

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
    return (
        <main className="overflow-x-hidden h-dvh flex flex-col items-center gap-2 p-5">
            <div className="flex items-center justify-between bg-white w-full rounded-xl px-5 py-3">
                <div className="p-2">
                    <GrTrophy className=" w-12 h-12 text-amber-500 " />
                </div>

                <div className="flex-1 flex-col">
                    <h2 className="font-bold text-center">
                        MOST INVITED FRENS
                    </h2>
                    <p className="text-center leading-4 text-sm text-pretty">Invite more frens to get into leader board! </p>
                </div>
            </div>
            <div className="flex flex-col items-center gap-2 w-full">
                {leaders?.map((leader: any, index: number) => {
                    return (
                        <div
                            key={leader.telegram_id}
                            className={cn(
                                "w-full h-10 bg-white rounded-lg grid grid-cols-7 ",
                                tgUser?.id == leader.telegram_id &&
                                    " ring-2 ring-purple-500"
                            )}
                        >
                            <div className="col-span-1 flex items-center justify-center">
                                <PlaceLabel index={index} />
                            </div>
                            <div className="col-span-5 gap-2 flex items-center">
                                <Avatar className="w-6 h-6">
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
                                        {leader?.first_name[0]}
                                    </AvatarFallback>
                                </Avatar>
                                <p className="text-ellipsis overflow-hidden line-clamp-1">
                                    {leader?.first_name || "Esim4U Fren"}
                                </p>
                            </div>
                            <div className="col-span-1 flex items-center justify-center">
                                <span className="  flex items-center min-w-9 px-1 justify-center  font-medium bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-md">
                                    {leader.referrals_count || 0}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </main>
    );
};

export default LeaderBoard;
