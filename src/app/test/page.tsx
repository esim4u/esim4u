"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTelegram } from "@/providers/telegram-provider";
import { useRouter, usePathname } from "next/navigation";
import { use, useEffect } from "react";

export default function Home() {
    const router = useRouter();
    const { user: tgUser, webApp, webAppUser} = useTelegram();

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
            <div>WEB APP USER</div>
            <pre className="text-balance">{JSON.stringify(webAppUser, null, 2)}</pre>
            <div>WEB APP</div>
            <pre className="text-balance">{JSON.stringify(webApp, null, 2)}</pre>

        </section>
    );
}
