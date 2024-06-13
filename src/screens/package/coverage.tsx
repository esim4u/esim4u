"use client";

import React, { useMemo, useState } from "react";
import { COUNTRIES } from "@/constants";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import ReactCountryFlag from "react-country-flag";

import { highlightMatches } from "@/lib/markup";

import Loader from "@/components/ui/loader";
import SearchInput from "@/components/shared/search-input";

const PackageCoverage = ({ params }: { params: { country_code: string } }) => {
    const [search, setSearch] = useState("");

    const {
        data: packageData,
        isLoading,
        isFetched,
    } = useQuery({
        queryKey: ["esim-packages", params.country_code],
        queryFn: async () => {
            const { data } = await axios.get(
                "/api/esims/packages/" + params.country_code,
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
                        type.toLowerCase().includes(query),
                    )
                );
            });
        });
    }, [search, packageData?.operators[0].coverages]);

    if (isLoading) {
        return (
            <main className="flex h-dvh flex-col items-center justify-center overflow-x-hidden ">
                <Loader />
            </main>
        );
    }

    return (
        <section className="flex h-dvh flex-col gap-4 p-5">
            <div className="fixed left-0 top-0 z-10 w-screen bg-background p-5">
                <SearchInput search={search} setSearch={setSearch} />
            </div>
            <div className="no-scrollbar relative -mb-6 flex flex-col gap-2 py-16">
                {filteredCoverage.map((country: any, index: number) => {
                    return (
                        <div
                            key={index}
                            className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-white p-2 transition-transform active:scale-95"
                        >
                            <div className="flex flex-row items-center  gap-4">
                                <ReactCountryFlag
                                    countryCode={country?.name}
                                    className="rounded-md"
                                    style={{
                                        width: "34px",
                                        height: "26px",
                                    }}
                                    svg
                                />
                                <span className="text-balance text-sm font-semibold uppercase leading-4">
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

export default PackageCoverage;
