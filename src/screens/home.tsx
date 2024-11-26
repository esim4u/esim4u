"use client";

import { useMemo, useState } from "react";
import { COUNTRIES } from "@/constants";
import { getWalletByUserId } from "@/services/supabase";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Fuse from "fuse.js";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

import { getPreferredLanguage, l } from "@/lib/locale";
import { useTelegram } from "@/hooks/use-telegram";

import Collapse from "@/components/ui/collapse";
import CustomInput from "@/components/ui/custom-input";
import Header from "@/components/home/header";
import PackagesList from "@/components/home/packages-list";
import Stories from "@/components/home/stories";
import Achievements from "@/components/shared/achievements";
import PopularCountries from "@/components/shared/popular-countries";
import SubscribeBanner from "@/components/shared/subscribe-banner";
import SupportProjectButton from "@/components/shared/support-project-button";

export default function Home() {
    const [search, setSearch] = useState("");
    const [isSearchError, setIsSearchError] = useState(false);
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    const { tgUser } = useTelegram();

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
        queryKey: ["wallet", tgUser?.id],
        queryFn: async () => {
            const data = await getWalletByUserId(tgUser?.id);
            return data;
        },
        placeholderData: keepPreviousData,
    });

    const {} = useQuery({
        queryKey: ["ratetonusd"],
        queryFn: async () => {
            const { data } = await axios.get(
                "https://tonapi.io/v2/rates?tokens=ton&currencies=usd",
            );
            return data.rates.TON.prices.USD;
        },
    });

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
                    } else {
                        setIsSearchError(false);
                    }
                }}
                isFocused={isSearchFocused}
                onFocus={() => {
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
                    <SupportProjectButton />
                </div>
            </Collapse>
        </main>
    );
}
