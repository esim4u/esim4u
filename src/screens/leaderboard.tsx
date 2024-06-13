"use client";

import React, { useEffect, useState } from "react";
import { useTelegram } from "@/providers/telegram-provider";
import { getLeaderboard, getUserById } from "@/services/supabase";
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
import Referrals from "@/components/user/referrals";

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
    useReferralLink(webApp, tgUser);

    const [isOpen, setIsOpen] = useState(false);

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

    return (
        <main className="flex h-dvh flex-col items-center gap-2 overflow-x-hidden p-5">
            <Banner />
            <div className="flex w-full flex-col items-center gap-2">
                {leaders?.map((leader: any, index: number) => {
                    return (
                        <div
                            key={leader.telegram_id}
                            className="flex w-full flex-col gap-2"
                        >
                            <div className="flex items-center gap-2">
                                <div
                                    key={leader.telegram_id}
                                    className={cn(
                                        "grid h-10 w-full grid-cols-7 rounded-lg bg-white ",
                                        tgUser?.id == leader.telegram_id &&
                                            " ring-2 ring-purple-500",
                                    )}
                                >
                                    <div className="col-span-1 flex items-center justify-center">
                                        <PlaceLabel index={index} />
                                    </div>
                                    <div className="col-span-5 flex items-center gap-2">
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage
                                                src={
                                                    (tgUser?.id ==
                                                        leader.telegram_id &&
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
                                        <p className="line-clamp-1 overflow-hidden text-ellipsis">
                                            {leader?.first_name ||
                                                "Esim4U Fren"}
                                        </p>
                                    </div>
                                    <div className="col-span-1 flex items-center justify-center">
                                        <span className="  flex min-w-9 items-center justify-center rounded-md  bg-gradient-to-r from-violet-500 to-purple-500 px-1 font-medium text-white">
                                            {leader.referrals_count || 0}
                                        </span>
                                    </div>
                                </div>
                                {tgUser?.id == leader.telegram_id && (
                                    <Button
                                        className={cn(
                                            "aspect-square min-w-10 bg-white  text-purple-600",
                                            isOpen &&
                                                " bg-gradient-to-tr from-indigo-500 to-purple-500 text-white",
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

                            {tgUser?.id == leader.telegram_id && (
                                <Collapse className="" isOpen={isOpen}>
                                    <Referrals hideTitle />
                                </Collapse>
                            )}
                        </div>
                    );
                })}
            </div>
        </main>
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
