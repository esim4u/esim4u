"use client";

import { useTelegram } from "@/providers/telegram-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BounceLoader from "@/components/ui/bounce-loader";

export default function SuccessPage() {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();

    useEffect(() => {
        if (webApp) {
            webApp?.BackButton.show();

            setTimeout(() => {
                router.push("/esims/pay/success");
            }, 3000);
        }
    }, [webApp]);

    return (
        <main className="overflow-x-hidden h-dvh flex flex-col justify-center items-center ">
            <div className="flex flex-col items-center gap-4">
                <BounceLoader dotClassName="bg-yellow-500" />
            </div>
        </main>
    );
}
