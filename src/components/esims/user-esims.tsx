"use client";

import { useTelegram } from "@/providers/telegram-provider";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import EsimCard from "./esim-card";
import { Esim } from "@/types";

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

    if (userEsims.length === 0) {
        return (
            <div>
                <div className="flex flex-col gap-2 h-32  items-center justify-center">
                    <h2 className="text-center font-medium text-3xl text-neutral-300">
                        COMING SOON
                    </h2>
                </div>
            </div>
        );
    }
    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="pl-4 flex  gap-2 uppercase items-center font-medium text-neutral-500">
                <h2>MY ESIMS</h2>
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
