"use client";

import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useTelegram } from "@/providers/telegram-provider";
import { MdArrowForwardIos } from "react-icons/md";
import { copyText, getReferralLink, hapticFeedback } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUserById } from "@/services/supabase";
import { Badge } from "../ui/badge";
import RefLinkButton from "../shared/ref-link-button";

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
                            <p className="text-ellipsis overflow-hidden max-w-28">
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
                <RefLinkButton />
            </div>
        </section>
    );
};

export default Header;
