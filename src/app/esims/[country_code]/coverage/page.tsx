"use client";

import SearchInput from "@/components/shared/search-input";
import BounceLoader from "@/components/ui/bounce-loader";
import { COUNTRIES } from "@/constants";
import { highlightMatches } from "@/lib/markup";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import ReactCountryFlag from "react-country-flag";
import { ScrollArea } from "@/components/ui/scroll-area";

const PackageCoveragePage = ({
    params,
}: {
    params: { country_code: string };
}) => {
    const [search, setSearch] = useState("");

    const {
        data: packageData,
        isLoading,
        isFetched,
    } = useQuery({
        queryKey: ["esim-packages", params.country_code],
        queryFn: async () => {
            const { data } = await axios.get(
                "/api/esims/packages/" + params.country_code
            );
            return data[0];
        },
        placeholderData: keepPreviousData,
    });

    const filteredCoverage = useMemo(() => {
        const coverage = packageData?.operators[0].coverages || [];
        const updatedCoverage = coverage.map((country: any) => {
            return {
                ...country,
                fullName: COUNTRIES[country.name.toLowerCase()] || country.name,
            };
        });

        const query = search.toLowerCase().trim();
        if (!query) return updatedCoverage;

        return updatedCoverage.filter((country: any) => {
            // Check if the country name matches the search query
            if (
                country.name.toLowerCase().includes(query) ||
                country.fullName?.toLowerCase().includes(query)
            )
                return true;
            // Check if any network name or type matches the search query
            return country.networks.some((network: any) => {
                return (
                    network.name.toLowerCase().includes(query) ||
                    network.types.some((type: any) =>
                        type.toLowerCase().includes(query)
                    )
                );
            });
        });
    }, [search, packageData?.operators[0].coverages]);

    if (isLoading) {
        return (
            <main className="overflow-x-hidden h-dvh flex flex-col justify-center items-center ">
                <BounceLoader />
            </main>
        );
    }

    return (
        <section className="flex flex-col h-dvh p-5 gap-4">
            <div className="fixed top-0 left-0 w-screen z-10 bg-background p-5">
                <SearchInput search={search} setSearch={setSearch} />
            </div>
            <div className="relative flex flex-col gap-2 -mb-6 no-scrollbar py-16">
                {filteredCoverage.map((country: any, index: number) => {
                    return (
                        <div
                            key={index}
                            className="cursor-pointer active:scale-95 transition-transform bg-white flex items-center justify-between w-full p-2 rounded-xl"
                        >
                            <div className="flex flex-row items-center gap-4">
                                <ReactCountryFlag
                                    countryCode={country?.name}
                                    className="rounded-md"
                                    style={{
                                        width: "34px",
                                        height: "26px",
                                    }}
                                    svg
                                />
                                <span className="uppercase text-balance text-sm leading-4 font-semibold">
                                    {highlightMatches(search, country.fullName)}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default PackageCoveragePage;
