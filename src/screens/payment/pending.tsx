"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTelegram } from "@/providers/telegram-provider";

import Loader from "@/components/ui/loader";

export default function Pending() {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();
    const searchParams = useSearchParams();
    const order_id = searchParams.get("order_id");

    useEffect(() => {
        if (webApp) {
            webApp?.BackButton.hide();

            setTimeout(() => {
                router.push(
                    "/esims/pay/success" +
                        (order_id ? `?order_id=${order_id}` : ""),
                );
            }, 3000);
        }
    }, [webApp]);

    return (
        <main className="flex h-dvh flex-col items-center justify-center overflow-x-hidden ">
            <div className="flex flex-col items-center gap-4">
                <Loader />
            </div>
        </main>
    );
}
