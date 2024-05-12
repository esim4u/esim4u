"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BounceLoader from "@/components/ui/bounce-loader";
import { useTelegram } from "@/providers/telegram-provider";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";
import { MdArrowForwardIos } from "react-icons/md";

export default function Home() {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();

    useEffect(() => {
        if (webApp) {
            webApp?.BackButton.show();
            webApp?.BackButton.onClick(() => {
                webApp?.BackButton.hide();
                router.push("/esims");
            });
        }
    }, [webApp]);

    return (
        <main className="overflow-x-hidden h-dvh flex flex-col justify-center items-center ">
            <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                    <Avatar className=" w-16 h-16">
                        <AvatarImage src={tgUser?.photo_url} alt="@shadcn" />
                        <AvatarFallback className=" bg-neutral-500 text-white">
                            {tgUser?.first_name[0]}
                        </AvatarFallback>
                    </Avatar>
                    <h2 className=" text-center text-neutral-500 font-medium leading-3">
                        {tgUser?.username ? `@${tgUser?.username}` : "@user"}
                    </h2>
                </div>
                <h2 className=" text-center text-lg text-neutral-500 font-medium  leading-3">
                    {tgUser?.first_name + " "} {tgUser?.last_name}
                </h2>
            </div>
        </main>
    );
}
