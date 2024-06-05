"use client";

import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { LANGUAGES } from "@/constants";
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
import { copyReferralLinkToClipBoard, hapticFeedback } from "@/lib/utils";
import { useTelegram } from "@/providers/telegram-provider";
import {
    disconnectUserWallet,
    getUserById,
    updateUserWallet,
} from "@/services/supabase";
import { sendGTMEvent } from "@next/third-parties/google";
import { useQuery } from "@tanstack/react-query";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";
import { track } from "@vercel/analytics/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import ReactCountryFlag from "react-country-flag";

export default function Settings() {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();
    const [preferredLang, setPreferredLang] = useState("");
    const tonAddress = useTonAddress();

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
            sendGTMEvent({ event: "share", value: "main_referral_copy" });
            track("share", { value: "main_referral_copy" });
            sendGTMEvent({ event: "main_referral_copy", value: "home" });
            copyReferralLinkToClipBoard(
                webApp?.initDataUnsafe?.user?.id.toString()
            );
        }
    }, [webApp]);

    useEffect(() => {
        webApp?.onEvent("mainButtonClicked", copyReferralLink);
        return () => {
            webApp?.offEvent("mainButtonClicked", copyReferralLink);
        };
    }, [webApp]);

    useEffect(() => {
        const updateWallet = async () => {
            await updateUserWallet(tgUser.id, tonAddress);
        };
        const disconnectWallet = async () => {
            await disconnectUserWallet(tgUser.id);
        };
        if (tonAddress) {
            updateWallet();
        } else {
            disconnectWallet();
        }
    }, [tonAddress]);

    return (
        <main className="overflow-x-hidden h-dvh flex flex-col justify-center items-center w-full p-5">
            <div className="flex flex-col items-center gap-4 w-full">
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
                        <SelectGroup >
                            {getSupportedLanguages().map((lang: any) => (
                                <SelectItem key={lang.value} value={lang.value}>
                                    <div className="flex gap-1 items-center">
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
                                    <div className="flex gap-1 items-center">
                                        <span className="font-bold text-[17px]">
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

                <div className=" flex gap-2 w-full">
                    {" "}
                    {["developer", "admin"].includes(
                        dbUserData?.badge.toLowerCase()
                    ) && (
                        <>
                            <Button
                                onClick={() => {
                                    hapticFeedback();
                                    router.push("/profile/sensitive-info");
                                }}
                                variant={"destructive"}
                                className="rounded-full w-full"
                            >
                                Sensitive info
                            </Button>
                            <Button
                                onClick={() => {
                                    hapticFeedback();
                                    router.push("/sandbox");
                                }}
                                variant={"destructive"}
                                className="rounded-full w-full"
                            >
                                Sandbox
                            </Button>
                        </>
                    )}
                </div>

                <div className="flex gap-2 w-full">
                    <Button
                        onClick={() => {
                            hapticFeedback();
                            router.push("/onboarding");
                        }}
                        className="rounded-full w-full"
                    >
                        {l("btn_onboarding")}
                    </Button>

                    <Button
                        onClick={() => {
                            webApp?.openTelegramLink(
                                "https://t.me/esim4u_support_bot/chat"
                            );
                        }}
                        className="rounded-full w-full"
                    >
                        {l("btn_support")}
                    </Button>
                </div>

                <div>
                    <TonConnectButton />
                </div>
            </div>
        </main>
    );
}
