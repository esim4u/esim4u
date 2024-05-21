"use client";

import { useTelegram } from "@/providers/telegram-provider";
import { useEffect, useMemo } from "react";

export default function Home() {
    const { webApp } = useTelegram();

    useEffect(() => {
        if (webApp) {
            webApp?.BackButton.show();
        }
    }, [webApp]);

    const items = useMemo(() => {
        if (!webApp) return [];
        let cloudStorageKeys = webApp?.CloudStorage.getKeys((e: any, keys: any) => {
            if (e) {
                console.log(e);
            }
            return keys;
        });
        return cloudStorageKeys;
    }, [webApp]);

    return (
        <section className="flex flex-col gap-5">
            <div>WEB APP</div>
            <pre className="text-balance">
                {JSON.stringify(webApp, null, 2)}
            </pre>
            CLOUD STORAGE
            <pre className="text-balance">{JSON.stringify(items, null, 2)}</pre>
        </section>
    );
}
