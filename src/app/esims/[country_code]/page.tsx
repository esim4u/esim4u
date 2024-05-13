"use client";

import { useTelegram } from "@/providers/telegram-provider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const EsimPackagePage = ({ params }: { params: { country_code: string } }) => {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();

    const { data: packageData, isLoading } = useQuery({
        queryKey: ["esim-packages", params.country_code],
        queryFn: async () => {
            const { data } = await axios.get(
                "/api/esims/packages/" + params.country_code
            );
            return data;
        },
    });

    useEffect(() => {
        if (webApp) {
            webApp?.BackButton.show();
            webApp?.BackButton.onClick(() => {
                webApp?.BackButton.hide();
                router.push("/esims");
            });
        }
    }, [webApp]);

    return (
        <section className="flex flex-col gap-5">
            <div>EsimPackagePage {params.country_code}</div>
            <pre className="text-balance">{JSON.stringify(packageData, null, 2)}</pre>
        </section>
    );
};

export default EsimPackagePage;
