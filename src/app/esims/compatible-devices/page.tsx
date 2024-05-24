"use client";

import SearchInput from "@/components/shared/search-input";
import BounceLoader from "@/components/ui/bounce-loader";
import { ScrollArea } from "@/components/ui/scroll-area";
import { COUNTRIES } from "@/constants";
import { highlightMatches } from "@/lib/markup";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useMemo, useState } from "react";
import ReactCountryFlag from "react-country-flag";

const CompatibleDevicesPage = () => {
    const [search, setSearch] = useState("");

    const {
        data: devices,
        isLoading,
        isFetched,
    } = useQuery({
        queryKey: ["compatible-devices"],
        queryFn: async () => {
            const { data } = await axios.get("/api/esims/compatible-devices");
            return data;
        },
        placeholderData: keepPreviousData,
    });

    const filteredDevices = useMemo(() => {
        if (!devices) return [];
        type Group = {
            [brand: string]: any[];
        };
        const group: Group = {};
        devices.forEach((device: any) => {
            const brand = device.brand.toLowerCase();
            if (!group[brand]) {
                group[brand] = [];
            }
            // Check if the device name already exists in the array
            const existingDevice = group[brand].find(
                (existingDevice) => existingDevice.name === device.name
            );
            if (!existingDevice) {
                group[brand].push(device);
            }
        });

        if (!search.trim()) {
            return group;
        }
        const searchLowerCase = search.trim().toLowerCase();
        const filtered: Group = {};

        // Filtering devices based on search query
        Object.keys(group).forEach((brand) => {
            const devices = group[brand].filter((device) => {
                return (
                    device.model.toLowerCase().includes(searchLowerCase) ||
                    device.brand.toLowerCase().includes(searchLowerCase) ||
                    device.name.toLowerCase().includes(searchLowerCase)
                );
            });

            if (devices.length > 0) {
                filtered[brand] = devices;
            }
        });

        return filtered;
    }, [devices, search]);

    if (isLoading) {
        return (
            <main className="overflow-x-hidden h-dvh flex flex-col justify-center items-center ">
                <BounceLoader />
            </main>
        );
    }

    return (
        <div>
            <section className="flex flex-col h-dvh p-5 gap-4">
                <div className="fixed top-0 left-0 w-screen z-10 bg-background p-5">
                    <SearchInput search={search} setSearch={setSearch} placeholder="Find your device" />{" "}
                </div>
                <div className="flex flex-col gap-5 -mb-6 py-16">
                    {Object.entries(filteredDevices).map(
                        ([brand, devices], index) => {
                            return (
                                <div
                                    key={index}
                                    className="flex flex-col gap-3"
                                >
                                    <h1 className="uppercase font-semibold text-md ml-4">
                                        {brand}
                                    </h1>
                                    {devices.map(
                                        (device: any, index: number) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className="cursor-pointer active:scale-95 transition-transform bg-white flex items-center justify-between w-full py-3 px-3 rounded-xl"
                                                >
                                                    <div className="flex flex-row items-center gap-4">
                                                        <span className="uppercase text-sm leading-4 font-semibold">
                                                            {highlightMatches(
                                                                search,
                                                                device.name
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            );
                        }
                    )}
                    {/* {filteredCoverage.map((country: any, index: number) => {
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
                })} */}
                </div>
            </section>
        </div>
    );
};

export default CompatibleDevicesPage;
