"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ITelegramUser, IWebApp } from "@/types";
import { useRouter } from "next/navigation";

export interface ITelegramContext {
    webApp?: any;
    user?: any;
    webAppUser?: any;
    // webApp?: IWebApp;
    // user?: ITelegramUser;
}

export const TelegramContext = createContext<ITelegramContext>({});

export const TelegramProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const router = useRouter();
    const [webApp, setWebApp] = useState<any>(null);

    useEffect(() => {
        const app = (window as any).Telegram?.WebApp;
        if (app) {
            app.setHeaderColor("#EFEFF3");	
            app.enableClosingConfirmation()	;	

            app?.SettingsButton.show();
            app?.SettingsButton.onClick(() => {
                router.push("/settings");
                webApp?.MainButton.hide();
            });


            app.ready();
            app.expand();
            setWebApp(app);
        }
    }, []);

    const value = useMemo(() => {
        return webApp
            ? {
                  webApp,
                  unsafeData: webApp.initDataUnsafe,
                  user: webApp.initDataUnsafe.user,
                  webAppUser: webApp.WebAppUser,
              }
            : {};
    }, [webApp]);

    return (
        <TelegramContext.Provider value={value}>
            {/* Make sure to include script tag with "beforeInteractive" strategy to pre-load web-app script */}
            {/*<Script
                src="https://telegram.org/js/telegram-web-app.js"
                strategy="beforeInteractive"
            />*/}
            {children}
        </TelegramContext.Provider>
    );
};

export const useTelegram = () => useContext(TelegramContext);
