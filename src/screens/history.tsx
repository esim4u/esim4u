"use client";

import Dot from "@/components/ui/dot";
import { Skeleton } from "@/components/ui/skeleton";
import { useTelegram } from "@/providers/telegram-provider";
import { getUsersEsimHistory } from "@/services/supabase";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import moment from "moment";
import Image from "next/image";
import React from "react";

type Props = {};

const History = (props: Props) => {
    const { user: tgUser, webApp } = useTelegram();
    const { data: history, isLoading } = useQuery({
        queryKey: ["history", tgUser?.id],
        queryFn: async () => {
            const data = await getUsersEsimHistory(tgUser.id);
            return data;
        },
        enabled: !!tgUser?.id,
    });

    if (isLoading) {
        <main className="overflow-x-hidden h-dvh flex flex-col items-center p-5">
            <div className="relative flex flex-col items-center gap-4 w-full">
                {Array(5)
                    .fill(null)
                    .map((item, index) => (
                        <Skeleton
                            key={index}
                            className="w-full rounded-lg"
                        ></Skeleton>
                    ))}
            </div>
        </main>;
    }

    return (
        <main className="overflow-x-hidden h-dvh flex flex-col items-center p-5">
            <div className="relative flex flex-col items-center gap-4 w-full">
                {history?.map((item, index) => (
                    <div
                        key={index}
                        className="w-full grid grid-cols-7 bg-white rounded-lg place-items-center gap-2 py-2 px-4"
                    >
                        <div className=" col-span-4 w-full">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1 font-medium">
                                    <Image
                                        src={item.image_url}
                                        alt={item.package_id}
                                        width={22}
                                        height={22}
                                        className="rounded-sm"
                                    />
                                    <h2>{item.coverage}</h2>
                                    <h2 className=" lowercase">
                                        {item.data.replace(" ", "")} /{" "}
                                        {item.validity}days
                                    </h2>
                                </div>
                                <span className="text-xs">{item.state}</span>
                            </div>
                        </div>
                        <div className="col-span-3 place-items-end w-full">
                            <div className="flex flex-col gap-1 items-end text-end">
                                <div className="flex  items-center gap-1 font-medium">
                                    <h2 className="">${item.price.total}</h2>
                                    <Dot className="size-[5px]" />
                                    <h2 className="flex items-center">
                                        {item.price.total_ton}
                                        <svg
                                            width="10"
                                            height="10"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <g clipPath="url(#clip0_2028_1457)">
                                                <path
                                                    d="M20.1036 -0.000366211H3.89546C0.91535 -0.000366211 -0.973515 3.21428 0.525777 5.81304L10.5289 23.1512C11.1816 24.2833 12.8175 24.2833 13.4702 23.1512L23.4753 5.81304C24.9726 3.21843 23.0837 -0.000366211 20.1057 -0.000366211H20.1036ZM10.5207 17.9517L8.34222 13.7355L3.08571 4.33417C2.73894 3.73244 3.16725 2.96135 3.89342 2.96135H10.5187V17.9538L10.5207 17.9517ZM20.9093 4.33214L15.6548 13.7376L13.4763 17.9517V2.95931H20.1016C20.8278 2.95931 21.2561 3.7304 20.9093 4.33214Z"
                                                    fill="#1B1C1F"
                                                />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_2028_1457">
                                                    <rect
                                                        width="24"
                                                        height="24"
                                                        fill="white"
                                                    />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                    </h2>
                                </div>
                                <span className="text-xs">
                                    {moment(item.created_at).format("lll")}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
};

export default History;
