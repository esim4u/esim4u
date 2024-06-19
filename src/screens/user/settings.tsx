"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LANGUAGES } from "@/constants";
import { useTelegram } from "@/providers/telegram-provider";
import { getUserById } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";
import { FaDonate } from "react-icons/fa";

import {
    getPreferredCurrencyCode,
    getSupportedCurrencies,
    setPreferredCurrency,
} from "@/lib/currency";
import {
    getPreferredLanguage,
    getSupportedLanguages,
    l,
    setLanguage,
} from "@/lib/locale";
import { hapticFeedback, shareRef } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import TCButton from "@/components/ui/tc-button";
import { sendGAEvent } from "@next/third-parties/google";

export default function Settings() {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();
    const [preferredLang, setPreferredLang] = useState("");

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
                text: l("btn_main_share"),
                color: "#3b82f6",
                is_active: true,
                is_visible: true,
            });
        }
    }, [webApp, preferredLang]);

    const copyReferralLink = useCallback(() => {
        if (webApp) {
            hapticFeedback("success");
            // copyReferralLinkToClipBoard(
            //     webApp?.initDataUnsafe?.user?.id.toString()
            // );
            sendGAEvent({ event: "share", value: "main-share-button-clicked" });

            webApp.openTelegramLink(shareRef(tgUser?.id.toString()));
        }
    }, [webApp]);

    useEffect(() => {
        webApp?.onEvent("mainButtonClicked", copyReferralLink);
        return () => {
            webApp?.offEvent("mainButtonClicked", copyReferralLink);
        };
    }, [webApp]);

    useEffect(() => {
        webApp?.onEvent("backButtonClicked", goBack);
        return () => {
            webApp?.offEvent("backButtonClicked", goBack);
        };
    }, [webApp]);

    const goBack = useCallback(() => {
        hapticFeedback("heavy");
        router.back();
    }, [webApp]);

    return (
        <main className="flex h-dvh w-full flex-col items-center justify-center overflow-x-hidden p-5">
            <div className="flex w-full flex-col items-center gap-4">
                <Select
                    onValueChange={(value) => {
                        setLanguage(value, router);
                        setPreferredLang(value);
                        hapticFeedback("success");
                    }}
                    defaultValue={getPreferredLanguage()}
                    onOpenChange={() => {
                        hapticFeedback();
                    }}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={l("input_title_language")} />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                        <SelectGroup>
                            {getSupportedLanguages().map((lang: any) => (
                                <SelectItem key={lang.value} value={lang.value}>
                                    <div className="flex items-center gap-1">
                                        <span className="font-bold">
                                            {LANGUAGES[lang.value]}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Select
                    onValueChange={(value) => {
                        setPreferredCurrency(value, router);
                        hapticFeedback("success");
                    }}
                    defaultValue={getPreferredCurrencyCode()}
                    onOpenChange={() => {
                        hapticFeedback();
                    }}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder={l("input_title_currency")} />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {getSupportedCurrencies().map((currency: any) => (
                                <SelectItem
                                    key={currency.value}
                                    value={currency.value}
                                >
                                    <div className="flex items-center gap-1">
                                        <span className="text-[17px] font-bold">
                                            {currency.symbol}
                                        </span>
                                        <span className="font-bold">
                                            {currency.label}
                                        </span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <div className=" flex w-full gap-2">
                    {" "}
                    {["developer", "admin"].includes(
                        dbUserData?.badge.toLowerCase(),
                    ) && (
                        <>
                            <Button
                                onClick={() => {
                                    hapticFeedback();
                                    router.push("/profile/sensitive-info");
                                }}
                                variant={"destructive"}
                                className="w-full rounded-full"
                            >
                                Sensitive info
                            </Button>
                            <Button
                                onClick={() => {
                                    hapticFeedback();
                                    router.push("/sandbox");
                                }}
                                variant={"destructive"}
                                className="w-full rounded-full"
                            >
                                Sandbox
                            </Button>
                        </>
                    )}
                </div>

                <div className="flex w-full gap-2">
                    <Button
                        onClick={() => {
                            hapticFeedback();
                            router.push("/onboarding");
                        }}
                        className="w-full rounded-full"
                    >
                        {l("btn_onboarding")}
                    </Button>

                    <Button
                        onClick={() => {
                            webApp?.openTelegramLink(
                                "https://t.me/esim4u_support_bot/chat",
                            );
                        }}
                        className="w-full rounded-full"
                    >
                        {l("btn_support")}
                    </Button>
                </div>
                <TCButton />
                <Button
                    onClick={() => {
                        hapticFeedback();
                        router.push("/donation");
                    }}
                    size={"lg"}
                    className="w-full gap-1 rounded-xl text-base"
                >
                    Donate <FaDonate className="h-[14px] w-[14px]" />
                </Button>
            </div>
        </main>
    );
}
