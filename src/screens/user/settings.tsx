"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LANGUAGES } from "@/constants";
import { getUserById } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";

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
import { useTelegram } from "@/hooks/use-telegram";

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
import SupportProjectButton from "@/components/shared/support-project-button";

export default function Settings() {
    const router = useRouter();
    const [preferredLang, setPreferredLang] = useState("");

    const { tgUser } = useTelegram();

    const { data: dbUserData, isLoading } = useQuery({
        queryKey: ["user", tgUser?.id],
        queryFn: async () => {
            const data = await getUserById(tgUser?.id);
            return data;
        },
    });

    return (
        <main className="flex h-dvh w-full flex-col items-center justify-center overflow-x-hidden p-5">
            <div className="flex w-full flex-col items-center gap-4">
                <Select
                    onValueChange={(value) => {
                        setLanguage(value, router);
                        setPreferredLang(value);
                    }}
                    defaultValue={getPreferredLanguage()}
                    onOpenChange={() => {}}
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
                    }}
                    defaultValue={getPreferredCurrencyCode()}
                    onOpenChange={() => {}}
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
                                    router.push("/profile/sensitive-info");
                                }}
                                variant={"destructive"}
                                className="w-full rounded-full"
                            >
                                Sensitive info
                            </Button>
                            <Button
                                onClick={() => {
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
                            router.push("/onboarding");
                        }}
                        className="w-full truncate rounded-full"
                    >
                        {l("btn_onboarding")}
                    </Button>

                    <Button
                        onClick={() => {}}
                        className="w-full truncate rounded-full"
                    >
                        {l("btn_support")}
                    </Button>
                </div>
                <TCButton />
                <SupportProjectButton />
            </div>
        </main>
    );
}
