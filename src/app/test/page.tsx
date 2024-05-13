"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTelegram } from "@/providers/telegram-provider";
import { useRouter } from "next/navigation";
import { use, useEffect } from "react";

export default function Home() {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();



    useEffect(() => {
        const app = (window as any).Telegram?.WebApp;

        alert(JSON.stringify(app, null, 2));

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
            <div>APP</div>

            <div>WEB APP</div>
            <pre className="text-balance">{JSON.stringify(webApp, null, 2)}</pre>

        </section>
    );
}
