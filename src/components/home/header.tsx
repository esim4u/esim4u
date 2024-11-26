"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { getUserById } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";
import { GrTrophy } from "react-icons/gr";
import { MdArrowForwardIos } from "react-icons/md";

import { hapticFeedback } from "@/lib/utils";
import { useTelegram } from "@/hooks/use-telegram";

import RefLinkButton from "../shared/ref-link-button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";

type Props = {};

const Header = (props: Props) => {
    const router = useRouter();

    const { tgUser } = useTelegram();

    const { data: dbUserData, isLoading } = useQuery({
        queryKey: ["user", tgUser?.id],
        queryFn: async () => {
            const data = await getUserById(tgUser?.id);
            return data;
        },
    });

    return (
        <section className="w-full">
            <div className="flex w-full items-center justify-between gap-5">
                <div
                    onClick={() => {
                        hapticFeedback();
                        router.push("/profile");
                    }}
                    className="flex cursor-pointer items-center  gap-2 transition-transform active:scale-95"
                >
                    <Avatar>
                        <AvatarImage
                            src={
                                tgUser?.photoUrl ||
                                dbUserData?.photo_url ||
                                "/img/default-user.png"
                            }
                            alt="@shadcn"
                        />
                        <AvatarFallback className=" bg-neutral-500 text-white">
                            {tgUser?.firstName ? tgUser?.firstName[0] : "U"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <div className="flex h-3 items-center gap-1 font-medium text-neutral-500">
                            <p className="max-w-20 overflow-hidden text-ellipsis  text-xs">
                                {tgUser?.username
                                    ? `@${tgUser?.username}`
                                    : "@user"}
                            </p>
                            <MdArrowForwardIos className="h-[14px] w-[14px]" />
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
                        className="flex size-10 min-w-10 items-center justify-center rounded-full bg-white active:scale-95"
                    >
                        <GrTrophy className=" text-amber-500 " />
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Header;
