"use client";

import BounceLoader from "@/components/ui/bounce-loader";
import { useTelegram } from "@/providers/telegram-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SettingsPage() {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();

    useEffect(() => {
        if (webApp) {
            webApp?.BackButton.show();
            webApp?.BackButton.onClick(() => {
                webApp?.MainButton.hide();
                webApp?.BackButton.hide();
                router.back()
            });
        }
    }, [webApp]);

    return (
        <main className="overflow-x-hidden h-dvh flex flex-col justify-center items-center ">
            <h2>This is setting page</h2>
        </main>
    );
}
