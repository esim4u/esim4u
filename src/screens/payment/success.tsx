"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTelegram } from "@/providers/telegram-provider";
import { FaRegCircleCheck } from "react-icons/fa6";

export default function Success() {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();

    useEffect(() => {
        if (webApp) {
            webApp?.BackButton.hide();

            setTimeout(() => {
                router.push("/profile?is_payment=true");
            }, 2000);
        }
    }, [webApp]);

    return (
        <main className="flex h-dvh flex-col items-center justify-center overflow-x-hidden ">
            <div className="flex flex-col items-center gap-4">
                <FaRegCircleCheck className="h-32 w-32 animate-appear text-green-500" />
            </div>
        </main>
    );
}
