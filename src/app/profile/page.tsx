"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserById } from "@/services/supabase";
import { useTelegram } from "@/providers/telegram-provider";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { copyText, getReferralLink, hapticFeedback } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import RefLinkButton from "@/components/shared/ref-link-button";
import Stories from "@/components/shared/stories";
import Achievements from "@/components/shared/achievements";
import { IoIosSettings } from "react-icons/io";
import { IoQrCode } from "react-icons/io5";

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
            webApp?.MainButton.setParams({
                text: "Share with friends",
                color: "#3b82f6",
                is_active: true,
                is_visible: true,
            });
        }
    }, [webApp]);

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

    return (
        <main className="overflow-x-hidden h-dvh flex flex-col items-center p-5">
            <div className="flex flex-col items-center gap-4">
                <IoIosSettings
                    onClick={() => {
                        hapticFeedback();
                        router.push("/settings");
                    }}
                    className="absolute left-5 w-12 h-12 text-neutral-400"
                />
                <IoQrCode
                    onClick={() => {
                        hapticFeedback();
                        router.push("/profile/qr");
                    }}
                    className="absolute right-5 w-12 h-12 py-1 text-neutral-400"
                />

                <div className="flex flex-col items-center gap-2">
                    <Avatar className="w-32 h-32">
                        <AvatarImage
                            src={
                                tgUser?.photo_url ||
                                dbUserData?.photo_url ||
                                "/img/default-user.png"
                            }
                            alt="@shadcn"
                        />
                        <AvatarFallback className=" bg-neutral-500 text-white">
                            {tgUser?.first_name[0]}
                        </AvatarFallback>
                    </Avatar>
                    <h2 className=" text-center text-neutral-500 font-medium leading-3">
                        {tgUser?.username ? `@${tgUser?.username}` : "@user"}
                    </h2>
                    <Badge size={"md"}>{dbUserData?.badge}</Badge>
                </div>

                <RefLinkButton />
                <Stories />
                <Achievements />
            </div>
        </main>
    );
}
