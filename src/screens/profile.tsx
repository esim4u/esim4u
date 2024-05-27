"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserById } from "@/services/supabase";
import { useTelegram } from "@/providers/telegram-provider";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { copyText, getReferralLink, hapticFeedback } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import RefLinkButton from "@/components/shared/ref-link-button";
import Achievements from "@/components/shared/achievements";
import { IoIosSettings } from "react-icons/io";
import { IoQrCode } from "react-icons/io5";
import UserEsims from "@/components/esims/user-esims";
import { sendGTMEvent } from "@next/third-parties/google";
import { track } from "@vercel/analytics/react";

export default function Profile() {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();

    const { data: dbUserData, isLoading } = useQuery({
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
            sendGTMEvent({ event: "share", value: "main_referral_copy" });
            track("share", { value: "main_referral_copy" });
            sendGTMEvent({ event: "main_referral_copy", value: "profile" });
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
            <div className="relative flex flex-col items-center gap-4 w-full">
                <IoIosSettings
                    onClick={() => {
                        hapticFeedback();
                        router.push("/settings");
                    }}
                    className="cursor-pointer absolute left-0 w-12 h-12 text-neutral-400"
                />
                <IoQrCode
                    onClick={() => {
                        hapticFeedback();
                        router.push("/profile/qr");
                    }}
                    className="cursor-pointer absolute right-0 w-12 h-12 py-1 text-neutral-400"
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
                <div className="-mx-5">
                    <Achievements titleClassName="px-8" className="pl-4 mr-4" />
                </div>
                <UserEsims />
            </div>
        </main>
    );
}
