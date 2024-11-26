"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { highlightMatches } from "@/lib/markup";

import AdPlaceholder from "./ad-placeholder";

type Props = {
    packages: any[];
    search: string;
};

const PackagesList = ({ packages, search }: Props) => {
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
                            router.push(
                                `/esims/${country.country_code || country.slug}`,
                            );
                        }}
                        key={index}
                        className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-white p-2 transition-transform active:scale-95"
                    >
                        <div className="flex flex-row items-center gap-4">
                            <div className="drop-shadow-[0_0px_2px_rgba(0,0,0,0.25)]">
                                <Image
                                    width={32}
                                    height={24}
                                    src={country.image.url}
                                    alt={country.title}
                                    className="esim-mask h-6 w-8"
                                />
                            </div>

                            <span className=" font-semibold">
                                {highlightMatches(
                                    search,
                                    country.matchKey == "translation"
                                        ? country.translation
                                        : country.title,
                                )}
                            </span>
                        </div>

                        {country.nestedMatchCountries &&
                            country.nestedMatchCountries[0]?.title && (
                                <span className=" text-sm font-semibold">
                                    incl.
                                    {highlightMatches(
                                        search,
                                        country.nestedMatchCountries[0]
                                            .matchKey == "translation"
                                            ? country.nestedMatchCountries[0]
                                                  .translation
                                            : country.nestedMatchCountries[0]
                                                  .title,
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
