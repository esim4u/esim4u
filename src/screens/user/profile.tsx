"use client";

import { Suspense, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTelegram } from "@/providers/telegram-provider";
import { getUserById } from "@/services/supabase";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { FaDonate } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { IoQrCode } from "react-icons/io5";

import { l } from "@/lib/locale";
import {
    copyReferralLinkToClipBoard,
    hapticFeedback,
    shareRef,
} from "@/lib/utils";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import UserEsims from "@/components/esims/user-esims";
// import RefLinkButton from "@/components/shared/ref-link-button";
import Achievements from "@/components/shared/achievements";
import RefLinkButton from "@/components/shared/ref-link-button";

export default function Profile() {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();
    const searchParams = useSearchParams();
    const is_payment = searchParams.get("is_payment") || false;

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

            if (is_payment) {
                webApp?.BackButton.hide();
            }
            webApp?.MainButton.setParams({
                text: l("btn_main_share"),
                color: "#3b82f6",
                is_active: true,
                is_visible: true,
            });
        }
    }, [webApp]);

    const copyReferralLink = useCallback(() => {
        if (webApp) {
            hapticFeedback();
            // copyReferralLinkToClipBoard(webApp?.initDataUnsafe?.user?.id.toString())
            webApp.openTelegramLink(shareRef(tgUser?.id.toString()));
        }
    }, [webApp]);

    const backToEsims = useCallback(() => {
        if (webApp) {
            hapticFeedback();
            router.push("/esims");
        }
    }, [webApp]);

    useEffect(() => {
        webApp?.offEvent("backButtonClicked");

        webApp?.onEvent("backButtonClicked", backToEsims);
        return () => {
            webApp?.offEvent("backButtonClicked", backToEsims);
        };
    }, [webApp]);

    useEffect(() => {
        webApp?.onEvent("mainButtonClicked", copyReferralLink);
        return () => {
            webApp?.offEvent("mainButtonClicked", copyReferralLink);
        };
    }, [webApp]);

    return (
        <main className="flex h-dvh flex-col items-center overflow-x-hidden p-5">
            <div className="relative flex w-full flex-col items-center gap-4">
                <IoIosSettings
                    onClick={() => {
                        hapticFeedback();
                        router.push("/settings");
                    }}
                    className="absolute left-0 h-12 w-12 cursor-pointer text-neutral-400"
                />
                <IoQrCode
                    onClick={() => {
                        hapticFeedback();
                        router.push("/profile/qr");
                    }}
                    className="absolute right-0 h-12 w-12 cursor-pointer py-1 text-neutral-400"
                />
                <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-32 w-32">
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
                    <h2 className=" text-center font-medium leading-3 text-neutral-500">
                        {tgUser?.username ? `@${tgUser?.username}` : "@user"}
                    </h2>
                    <Badge size={"md"}>{dbUserData?.badge}</Badge>
                </div>
                <RefLinkButton />
                <Achievements fullWidth />
                <Suspense fallback={<div></div>}>
                    <UserEsims />
                </Suspense>

                {/* <Referrals /> */}
                <Button
                    onClick={() => {
                        hapticFeedback();
                        router.push("/donation");
                    }}
                    size={"lg"}
                    className="w-full gap-1 rounded-xl  text-base"
                >
                    Donate <FaDonate className="h-[14px] w-[14px]" />
                </Button>
            </div>
        </main>
    );
}
