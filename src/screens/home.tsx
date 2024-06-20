"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES } from "@/constants";
import { useTelegram } from "@/providers/telegram-provider";
import { sendGAEvent } from "@next/third-parties/google";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Fuse from "fuse.js";
import { FaDonate } from "react-icons/fa";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

import { getPreferredLanguage, l } from "@/lib/locale";
import { hapticFeedback, loseFocus, shareRef } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Collapse from "@/components/ui/collapse";
import CustomInput from "@/components/ui/custom-input";
import Header from "@/components/home/header";
import PackagesList from "@/components/home/packages-list";
import Stories from "@/components/home/stories";
import Achievements from "@/components/shared/achievements";
import PopularCountries from "@/components/shared/popular-countries";
import SubscribeBanner from "@/components/shared/subscribe-banner";
import { track } from "@vercel/analytics/react";
import SupportProjectButton from "@/components/shared/support-project-button";

export default function Home() {
    const { user: tgUser, webApp } = useTelegram();

    const [search, setSearch] = useState("");
    const [isSearchError, setIsSearchError] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

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

    useEffect(() => {
        if (webApp) {
            webApp?.BackButton.hide();
        }
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

    const copyReferralLink = useCallback(() => {
        if (webApp) {
            hapticFeedback("success");

            webApp.openTelegramLink(shareRef(tgUser?.id.toString()));
            sendGAEvent({ event: "share", value: "main-share-button-clicked" });
            track("subscription_banner-clicked")
            track("main-share-button-clicked")
            // copyReferralLinkToClipBoard(
            //     webApp?.initDataUnsafe?.user?.id.toString()
            // );
        }
    }, [webApp]);

    const handleLoseFocus = useCallback(() => {
        if (webApp) {
            setIsSearchFocused(false);
            loseFocus();
        }
    }, [webApp]);

    useEffect(() => {
        if (isSearchFocused) {
            webApp?.MainButton.setParams({
                text: "Finish searching",
                color: "#EF3671",
                is_active: true,
                is_visible: true,
            });

            webApp?.onEvent("mainButtonClicked", handleLoseFocus);
            return () => {
                webApp?.offEvent("mainButtonClicked", handleLoseFocus);
            };
        } else {
            webApp?.MainButton.setParams({
                text: l("btn_main_share"),
                color: "#3b82f6",
                is_active: true,
                is_visible: true,
            });
            webApp?.onEvent("mainButtonClicked", copyReferralLink);
            return () => {
                webApp?.offEvent("mainButtonClicked", copyReferralLink);
            };
        }
    }, [webApp, isSearchFocused]);

    const filteredPackages = useMemo(() => {
        if (!search) return [];
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
                        nestedCountry.translation != item.translation,
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
        <main className=" flex flex-col gap-4 px-5">
            <Collapse className="-mx-5 " isOpen={!isSearchFocused}>
                <div className="flex flex-col gap-4">
                    <div className="px-5 pt-5">
                        <Header />
                    </div>

                    <Stories className="mr-4 pl-4" />
                    <SubscribeBanner className={"mx-4"} />

                </div>
            </Collapse>

            <CustomInput
                id="country-search"
                icon={HiMiniMagnifyingGlass}
                value={search}
                setValue={(value) => {
                    setSearch(value);

                    if (value.length > 2 && filteredPackages?.length === 0) {
                        setIsSearchError(true);
                        hapticFeedback("warning");
                    } else {
                        setIsSearchError(false);
                    }
                }}
                isFocused={isSearchFocused}
                onFocus={() => {
                    hapticFeedback();
                    setIsSearchFocused(true);
                }}
                setIsFocused={setIsSearchFocused}
                isError={isSearchError}
            />

            {isSearchFocused && filteredPackages && (
                <PackagesList packages={filteredPackages} search={search} />
            )}
            <Collapse className=" duration-200" isOpen={!isSearchFocused}>
                <div className="flex flex-col gap-4 pb-4">
                    <PopularCountries />
                    <Achievements fullWidth />
                    <SupportProjectButton/>
                </div>
            </Collapse>
        </main>
    );
}
