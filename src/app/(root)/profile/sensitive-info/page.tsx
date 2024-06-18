"use client";

import { hapticFeedback } from "@/lib/utils";
import { useTelegram } from "@/providers/telegram-provider";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

export default function Home() {
    const { webApp } = useTelegram();
    const router = useRouter();
    const [items, setItems] = useState([]);
    const [localStorageData, setLocalStorageData] = useState([]);

    useEffect(() => {
        if (webApp) {
            webApp?.BackButton.show();
        }
    }, [webApp]);

    useEffect(() => {
        webApp?.onEvent("backButtonClicked", goBack);
        return () => {
            webApp?.offEvent("backButtonClicked", goBack);
        };
    }, [webApp]);

    const goBack = useCallback(() => {
        hapticFeedback("heavy");
        router.back();
    }, [webApp]);

    useEffect(() => {
        webApp?.CloudStorage.getKeys((e: any, keys: any) => {
            if (e) {
                console.log(e);
                return;
            }
            if (!keys.length) {
                return;
            }

            webApp?.CloudStorage.getItems(keys, (e: any, items: any) => {
                if (e) {
                    console.log(e);
                }
                setItems(items);
            });

            if (typeof window !== "undefined") {
                const data = Object.keys(window.localStorage).map((key) => ({
                    key,
                    value: window.localStorage.getItem(key),
                }));
                setLocalStorageData(data as any);
            }
        });
    }, [webApp]);

    return (
        <section className="flex flex-col gap-5">
            WEB APP
            <pre className="text-balance">
                {JSON.stringify(webApp, null, 2)}
            </pre>
            CLOUD STORAGE
            <pre className="text-balance">{JSON.stringify(items, null, 2)}</pre>
            LOCAL STORAGE
            <pre className="text-balance">
                {JSON.stringify(localStorageData, null, 2)}
            </pre>
        </section>
    );
}
