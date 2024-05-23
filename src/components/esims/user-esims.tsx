"use client";

import { useTelegram } from "@/providers/telegram-provider";
import { useQuery } from "@tanstack/react-query";
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
    });

    return (
        <div className="flex flex-col gap-5 w-full">
            {userEsims?.map((esim: Esim) => (
                <EsimCard
                    key={esim.iccid}
                    iccid={esim.iccid}
                    status={esim.status}
                    state={esim.state}
                    coverage={esim.coverage}
                    image_url={esim.image_url}
                    validity={esim.validity}
                    data={esim.data}
                    qrcode_url={esim.qrcode_url}
                    sm_dp={esim.sm_dp}
                    confirmation_code={esim.confirmation_code}
                    type={esim.type}
                    usage={esim.usage}
                    expired_at={esim.expired_at}
                />
            ))}
        </div>
    );
};

export default UserEsims;
