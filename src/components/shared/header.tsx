"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useTelegram } from "@/providers/telegram-provider";
import { MdArrowForwardIos } from "react-icons/md";
import { BsFire } from "react-icons/bs";

type Props = {};

const Header = (props: Props) => {
    const { user: tgUser, webApp } = useTelegram();

    return (
        <section className="w-full">
            <div className="flex gap-5 justify-between w-full">
                <div className="flex items-center gap-2">
                    <Avatar className=" w-11 h-11 border-2 border-neutral-500/5 ">
                        <AvatarImage src={tgUser?.photo_url} alt="@shadcn" />
                        <AvatarFallback>{tgUser?.first_name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-1">
                        <h2 className="flex text-neutral-500 font-medium items-center gap-1 leading-3">
                            {tgUser?.username
                                ? `@${tgUser?.username}`
                                : "@user"}
                            <MdArrowForwardIos />
                        </h2>
                        <span className=" bg-neutral-500 w-fit rounded-md py-0.5 px-2 text-white text-[8px] font-medium">
                            New user
                        </span>
                    </div>
                </div>
                <div className="bg-white h-10 p-2 pr-3 gap-1 flex items-center rounded-full">
                    <BsFire className=" w-7 h-7 text-red-500" />
                    <div className=" flex flex-col">
                        <span className="text-[10px]  font-semibold">
                            Click to copy referral link
                        </span>
                        <span className="text-[8px] text-neutral-500 font-medium">
                            and share with your friends
                        </span>
                    </div>
                </div>
            </div>

        </section>
    );
};

export default Header;
