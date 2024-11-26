"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

import { l } from "@/lib/locale";
import { highlightMatches } from "@/lib/markup";

import CustomInput from "@/components/ui/custom-input";
import Loader from "@/components/ui/loader";
import { hapticFeedback } from "@/lib/utils";
import { useRouter } from "next/navigation";

const Devices = () => {
    const [search, setSearch] = useState("");
    const router = useRouter();

    const { data: devices, isLoading } = useQuery({
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
                (existingDevice) => existingDevice.name === device.name,
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
            <main className="flex h-dvh flex-col items-center justify-center overflow-x-hidden ">
                <Loader />
            </main>
        );
    }

    return (
        <div>
            <section className="flex h-dvh flex-col gap-4 p-5">
                <div className="fixed left-0 top-0 z-10 w-screen bg-background p-5">
                    <CustomInput
                        icon={HiMiniMagnifyingGlass}
                        value={search}
                        setValue={setSearch}
                        placeholder={l("input_search_device")}
                    />{" "}
                </div>
                <div className="-mb-6 flex flex-col gap-5 py-16">
                    {Object.entries(filteredDevices).map(
                        ([brand, devices], index) => {
                            return (
                                <div
                                    key={index}
                                    className="flex flex-col gap-3"
                                >
                                    <h1 className="text-md ml-4 font-semibold uppercase">
                                        {brand}
                                    </h1>
                                    {devices.map(
                                        (device: any, index: number) => {
                                            return (
                                                <div
                                                    key={index}
                                                    className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-white px-3 py-3 transition-transform active:scale-95"
                                                >
                                                    <div className="flex flex-row items-center gap-4">
                                                        <span className="text-sm font-semibold uppercase leading-4">
                                                            {highlightMatches(
                                                                search,
                                                                device.name,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        },
                                    )}
                                </div>
                            );
                        },
                    )}
                </div>
            </section>
        </div>
    );
};

export default Devices;
