"use client";

import { useTelegram } from "@/providers/telegram-provider";

export default function Home() {
    const { user, webApp } = useTelegram();
    console.log(user, webApp);
    return (
        <main>
            <div>
                <pre className="text-black">
                    {JSON.stringify(user, null, 2)}
                </pre>
                <pre className="text-black">
                    {JSON.stringify(webApp, null, 2)}
                </pre>
            </div>
        </main>
    );
}
