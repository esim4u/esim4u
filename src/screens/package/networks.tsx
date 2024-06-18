"use client";

import React, { useMemo, useState } from "react";
import { COUNTRIES } from "@/constants";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import ReactCountryFlag from "react-country-flag";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

import { highlightMatches } from "@/lib/markup";

import CustomInput from "@/components/ui/custom-input";
import Loader from "@/components/ui/loader";

const Networks = ({ params }: { params: { package_id: string } }) => {
    const [search, setSearch] = useState("");

    const { data: networks, isLoading } = useQuery({
        queryKey: ["networks", params.package_id],
        queryFn: async () => {
            const { data } = await axios.get(
                "/api/esims/networks/" + params.package_id,
            );
            return data;
        },
        placeholderData: keepPreviousData,
    });

    const filteredNetworks = useMemo(() => {
        const updatedNetworks = networks.map((country: any) => {
            return {
                ...country,
                fullName: COUNTRIES[country.name.toLowerCase()] || country.name,
            };
        });

        const query = search.toLowerCase().trim();
        if (!query) return updatedNetworks;

        return updatedNetworks.filter((country: any) => {
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
    }, [networks, search]);

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
                <CustomInput
                    icon={HiMiniMagnifyingGlass}
                    value={search}
                    setValue={setSearch}
                    placeholder="Search countries or networks"
                />
            </div>
            <div className="no-scrollbar relative -mb-6 flex flex-col gap-2 py-16">
                {filteredNetworks?.map((network: any, index: number) => (
                    <div
                        className="flex w-full items-center justify-between rounded-xl bg-white p-2"
                        key={index}
                    >
                        <div className="  flex items-center gap-1">
                            <ReactCountryFlag
                                countryCode={network.name}
                                svg
                                style={{
                                    width: "2.25em",
                                    height: "1.6em",
                                }}
                                className="overflow-hidden rounded-md object-cover"
                            />
                            <h2 className=" text-lg font-semibold leading-5">
                                {highlightMatches(
                                    search,
                                    COUNTRIES[network.name.toLowerCase()] ||
                                        network.name,
                                )}
                            </h2>
                        </div>

                        <div className="flex w-1/2 justify-end gap-1">
                            {network.networks.map((n: any, index: number) => (
                                <div className=" rounded-sm border-2 border-black px-2 text-sm">
                                    <h2>
                                        {highlightMatches(search, n.name)}(
                                        {n.types})
                                    </h2>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Networks;
