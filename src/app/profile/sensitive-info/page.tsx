"use client";

import { useTelegram } from "@/providers/telegram-provider";
import { useEffect } from "react";

export default function Home() {
    const {  webApp } = useTelegram();

    useEffect(() => {
        if (webApp) {
            webApp?.BackButton.show();
        }
    }, [webApp]);

    return (
        <section className="flex flex-col gap-5">
            <div>WEB APP</div>
            <pre className="text-balance">
                {JSON.stringify(webApp, null, 2)}
            </pre>
        </section>
    );
}
