"use client";

import Header from "@/components/home/header";
import { copyReferralLinkToClipBoard, hapticFeedback } from "@/lib/utils";
import { useTelegram } from "@/providers/telegram-provider";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Stories from "@/components/home/stories";
import Achievements from "@/components/shared/achievements";
import Fuse from "fuse.js";
import SearchInput from "@/components/shared/search-input";
import { highlightMatches } from "@/lib/markup";
import PopularCountries from "@/components/shared/popular-countries";
import { COUNTRIES } from "@/constants";
import { sendGTMEvent } from "@next/third-parties/google";
import { track } from "@vercel/analytics/react";
import { getPreferredLanguage, l } from "@/lib/locale";

export default function Home() {
    const { user: tgUser, webApp } = useTelegram();
    const [search, setSearch] = useState("");
    const [isSearchError, setIsSearchError] = useState(false);
    const router = useRouter();

    const { data: packages, isLoading } = useQuery({
        queryKey: ["esim-packages"],
        queryFn: async () => {
            const { data } = await axios.get("/api/esims/packages", {
                params: {
                    lang: getPreferredLanguage(),
                },
            });
            return data;
        },
        placeholderData: keepPreviousData,
    });

    const {} = useQuery({
        queryKey: ["user-esims", tgUser?.id],
        queryFn: async () => {
            const data = await axios.get(`/api/user/${tgUser.id}/esims`);
            return data.data;
        },
        placeholderData: keepPreviousData,
        enabled: !!tgUser?.id,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 60, // 1 hour
    });

    useEffect(() => {
        if (webApp) {
            webApp?.BackButton.hide();
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
            hapticFeedback("success");
            sendGTMEvent({ event: "share", value: "main_referral_copy" });
            track("share", { value: "main_referral_copy" });
            sendGTMEvent({ event: "main_referral_copy", value: "home" });
            copyReferralLinkToClipBoard(webApp?.initDataUnsafe?.user?.id.toString())
        }
    }, [webApp]);

    useEffect(() => {
        webApp?.onEvent("mainButtonClicked", copyReferralLink);
        return () => {
            webApp?.offEvent("mainButtonClicked", copyReferralLink);
        };
    }, [webApp]);

    const filteredPackages = useMemo(() => {
        if (search && packages && packages.length) {
            const query = search.toLowerCase().trim();

            const fuse = new Fuse(packages, {
                keys: [
                    "slug",
                    "country_code",
                    "translation",
                    "operators.countries.title",
                    "operators.countries.country_code",
                    "operators.countries.translation",
                ],
                threshold: 0.3,
                includeMatches: true,
            });

            const matchingPackages = fuse.search(query).map((result) => {
                const item = result.item as any;

                const matchedKey = result.matches && result.matches[0].key;

                const countries = item.operators[0].countries;

                const nestedFuse = new Fuse(countries, {
                    keys: ["title", "country_code", "translation"],
                    threshold: 0.3,
                    includeMatches: true,
                });

                let nestedMatchCountries = nestedFuse
                    .search(query)
                    .map((result) => {
                        const item = result.item as any;
                        const matchedKey =
                            result.matches && result.matches[0].key;

                        return {
                            ...item,
                            fullName:
                                COUNTRIES[item.title.toLowerCase()] ||
                                item.title,
                            matchKey: matchedKey,
                        };
                    });
                console.log(item);
                console.log(nestedMatchCountries);

                nestedMatchCountries = nestedMatchCountries.filter(
                    (nestedCountry) =>
                        nestedCountry.title != item.title &&
                        nestedCountry.country_code != item.country_code &&
                        nestedCountry.translation != item.translation
                );

                return {
                    ...item,
                    matchKey: matchedKey,
                    nestedMatchCountries,
                };
            });

            return matchingPackages;
        }
    }, [packages, search]);

    return (
        <main className="overflow-x-hidden flex flex-col h-dvh p-5 gap-4">
            <Header />
            <div className="-mx-5 ">
                <Stories className="pl-4 mr-4" />
            </div>

            <SearchInput
                search={search}
                setSearch={(value) => {
                    setSearch(value);

                    if (
                        value.length > 2 &&
                        filteredPackages?.length === 0
                    ) {
                        setIsSearchError(true);
                        hapticFeedback("warning");
                    } else {
                        setIsSearchError(false);
                    }
                }}
                isError={isSearchError}
            />

            {filteredPackages && filteredPackages.length ? (
                <div className="flex flex-col gap-2">
                    {filteredPackages.map((country: any, index: number) => {
                        return (
                            <div
                                onClick={() => {
                                    hapticFeedback();
                                    webApp?.MainButton.setParams({
                                        text: l("btn_pay"),
                                        color: "#444444",
                                        is_active: false,
                                        is_visible: true,
                                    });
                                    router.push(
                                        `/esims/${
                                            country.country_code || country.slug
                                        }`
                                    );
                                }}
                                key={index}
                                className="cursor-pointer active:scale-95 transition-transform bg-white flex items-center justify-between w-full p-2 rounded-xl"
                            >
                                <div className="flex flex-row items-center gap-4">
                                    <Image
                                        width={32}
                                        height={24}
                                        src={country.image.url}
                                        alt={country.title}
                                        className="rounded-md w-8 h-6"
                                    />
                                    <span className=" font-semibold">
                                        {highlightMatches(
                                            search,
                                            country.matchKey == "translation"
                                                ? country.translation
                                                : country.title
                                        )}
                                    </span>
                                </div>

                                {country.nestedMatchCountries &&
                                    country.nestedMatchCountries[0]?.title && (
                                        <span className=" font-semibold text-sm">
                                            incl.
                                            {highlightMatches(
                                                search,
                                                country.nestedMatchCountries[0]
                                                    .matchKey == "translation"
                                                    ? country
                                                          .nestedMatchCountries[0]
                                                          .translation
                                                    : country
                                                          .nestedMatchCountries[0]
                                                          .title
                                            )}
                                        </span>
                                    )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <PopularCountries />
                    <Achievements fullWidth />
                </div>
            )}
        </main>
    );
}
