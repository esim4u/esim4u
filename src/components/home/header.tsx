"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTelegram } from "@/providers/telegram-provider";
import { getUserById } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";
import { GrTrophy } from "react-icons/gr";
import { MdArrowForwardIos } from "react-icons/md";

import { hapticFeedback } from "@/lib/utils";

import RefLinkButton from "../shared/ref-link-button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

type Props = {};

const Header = (props: Props) => {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();

    const { data: dbUserData, isLoading } = useQuery({
        queryKey: ["user", tgUser?.id],
        queryFn: async () => {
            const data = await getUserById(tgUser.id);
            return data;
        },
    });

    return (
        <section className="w-full">
            <div className="flex items-center gap-5 justify-between w-full">
                <div
                    onClick={() => {
                        hapticFeedback();
                        router.push("/profile");
                    }}
                    className="flex items-center gap-2  cursor-pointer transition-transform active:scale-95"
                >
                    <Avatar>
                        <AvatarImage
                            src={
                                tgUser?.photo_url ||
                                dbUserData?.photo_url ||
                                "/img/default-user.png"
                            }
                            alt="@shadcn"
                        />
                        <AvatarFallback className=" bg-neutral-500 text-white">
                            {tgUser?.first_name ? tgUser?.first_name[0] : "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center text-neutral-500 font-medium gap-1 h-3">
                            <p className="text-ellipsis overflow-hidden max-w-20  text-xs">
                                {tgUser?.username
                                    ? `@${tgUser?.username}`
                                    : "@user"}
                            </p>
                            <MdArrowForwardIos className="w-[14px] h-[14px]" />
                        </div>

                        <Badge size={"sm"}>
                            {dbUserData?.badge || "New user"}
                        </Badge>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <RefLinkButton />
                    <div
                        onClick={() => {
                            hapticFeedback();
                            router.push("/leaderboard");
                        }}
                        className="active:scale-95 flex items-center justify-center min-w-10 size-10 bg-white rounded-full"
                    >
                        <GrTrophy className=" text-amber-500 " />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Header;
