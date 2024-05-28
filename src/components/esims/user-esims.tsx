"use client";

import { useTelegram } from "@/providers/telegram-provider";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import EsimCard from "./esim-card";
import { Esim } from "@/types";
import { l } from "@/lib/locale";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

type Props = {};

const UserEsims = (props: Props) => {
    const { user: tgUser, webApp } = useTelegram();

    const { data: userEsims, isLoading } = useQuery({
        queryKey: ["user-esims", tgUser?.id],
        queryFn: async () => {
            const data = await axios.get(`/api/user/${tgUser.id}/esims`);
            return data.data;
        },
        placeholderData: keepPreviousData,
    });

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2 w-full">
                <div className="pl-4 flex  gap-2 uppercase items-center font-medium text-neutral-500">
                    <h2>{l("title_esims")}</h2>
                </div>
                <div className="flex flex-col gap-5 w-full">
                    {Array(4).fill(null).map((_, index) => (
                        <Skeleton key={index}/>
                    ))}
                </div>
            </div>
        );
    }

    if (userEsims?.length === 0) {
        return (
            <div className=" w-full">
                <div className="relative flex flex-col items-center justify-center gap-2 bg-white rounded-3xl h-[180px] w-full">
                    <div
                        className={cn(
                            "absolute left-4 top-4 flex  gap-2 uppercase items-center font-medium text-neutral-500"
                        )}
                    >
                        <h2>{l("title_esims")}</h2>{" "}
                    </div>
                    <div className="flex flex-col gap-2 mt-1 items-center justify-center">
                        <h2 className="text-center font-medium text-3xl text-neutral-300">
                            NO ESIMS YET
                        </h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="pl-4 flex  gap-2 uppercase items-center font-medium text-neutral-500">
                <h2>{l("title_esims")}</h2>
            </div>
            <div className="flex flex-col gap-5 w-full">
                {userEsims?.map((esim: Esim) => (
                    <EsimCard
                        key={esim.iccid}
                        iccid={esim.iccid}
                        state={esim.state}
                        coverage={esim.coverage}
                        image_url={esim.image_url}
                        validity={esim.validity}
                        data={esim.data}
                        sm_dp={esim.sm_dp}
                        confirmation_code={esim.confirmation_code}
                        type={esim.type}
                        usage={esim.usage}
                        expired_at={esim.expired_at}
                    />
                ))}
            </div>
        </div>
    );
};

export default UserEsims;
