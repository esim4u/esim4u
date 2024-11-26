"use client";

import React, { useCallback, useEffect } from "react";
import Image from "next/image";
import { getUsersEsimHistory } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";
import moment from "moment";

import Dot from "@/components/ui/dot";
import { Skeleton } from "@/components/ui/skeleton";
import { TonIcon } from "@/components/icons";
import { hapticFeedback } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useTelegram } from "@/hooks/use-telegram";

type Props = {};

const History = (props: Props) => {
    const { tgUser } = useTelegram();
    const router = useRouter();
    const { data: history, isLoading } = useQuery({
        queryKey: ["history", tgUser?.id],
        queryFn: async () => {
            const data = await getUsersEsimHistory(tgUser?.id);
            return data;
        },
        enabled: !!tgUser?.id,
    });

    if (isLoading) {
        <main className="flex h-dvh flex-col items-center overflow-x-hidden p-5">
            <div className="relative flex w-full flex-col items-center gap-4">
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
        <main className="flex h-dvh flex-col items-center overflow-x-hidden p-5">
            <div className="relative flex w-full flex-col items-center gap-4">
                {history?.map((item, index) => (
                    <div
                        key={index}
                        className="grid w-full grid-cols-7 place-items-center gap-2 rounded-lg bg-white px-4 py-2"
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
                        <div className="col-span-3 w-full place-items-end">
                            <div className="flex flex-col items-end gap-1 text-end">
                                <div className="flex  items-center gap-1 font-medium">
                                    <h2 className="">${item.price.total}</h2>
                                    <Dot className="size-[5px]" />
                                    <h2 className="flex items-center">
                                        {item.price.total_ton}
                                        <TonIcon className="h-3 w-3" />
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
