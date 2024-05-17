"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserById } from "@/services/supabase";
import { useTelegram } from "@/providers/telegram-provider";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { copyText, getReferralLink } from "@/lib/utils";

export default function Home() {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();

    const { data: dbUserData, isLoading } = useQuery({
        queryKey: ["user", tgUser?.id],
        queryFn: async () => {
            const data = await getUserById(tgUser.id);
            return data;
        },
    });


    useEffect(() => {
        if (webApp) {
            webApp?.BackButton.show();
            webApp.MainButton.setParams({
                text: "Share with friends",
                color: "#3b82f6",
                is_active: true,
                is_visible: true,
            });
        }
    }, [webApp]);


    const copyReferralLink = useCallback(() => {
        if (webApp) {
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


    return (
        <main className="overflow-x-hidden h-dvh flex flex-col justify-center items-center ">
            <div className="flex flex-col items-center gap-4">
                <div className="flex flex-col items-center gap-2">
                    <Avatar className=" w-16 h-16">
                        <AvatarImage
                            src={tgUser?.photo_url || dbUserData?.photo_url}
                            alt="@shadcn"
                        />
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
                {["developer", "admin"].includes(
                    dbUserData?.badge.toLowerCase()
                ) && (
                    <Button onClick={()=>{
                        router.push("/profile/sensitive-info")
                    }} variant={"destructive"} className="rounded-full">
                        Sensitive info
                    </Button>
                )}
            </div>
        </main>
    );
}
