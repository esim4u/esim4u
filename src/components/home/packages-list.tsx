"use client";

import { l } from "@/lib/locale";
import { highlightMatches } from "@/lib/markup";
import { hapticFeedback } from "@/lib/utils";
import { useTelegram } from "@/providers/telegram-provider";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import AdPlaceholder from "./ad-placeholder";

type Props = {
    packages: any[];
    search: string;
};

const PackagesList = ({ packages, search }: Props) => {
    const { webApp } = useTelegram();
    const router = useRouter();

    if (packages.length === 0) {
        return <AdPlaceholder />;
    }
    return (
        <div className="flex flex-col gap-2">
            {packages.map((country: any, index: number) => {
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
                                `/esims/${country.country_code || country.slug}`
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
                                            ? country.nestedMatchCountries[0]
                                                  .translation
                                            : country.nestedMatchCountries[0]
                                                  .title
                                    )}
                                </span>
                            )}
                    </div>
                );
            })}
        </div>
    );
};

export default PackagesList;
