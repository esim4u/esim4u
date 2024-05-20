"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import type { ITelegramUser, IWebApp } from "@/types";
import { useRouter } from "next/navigation";
import { hapticFeedback } from "@/lib/utils";

export interface ITelegramContext {
    webApp?: any;
    user?: any;
    start_param?: string | number;
    cloudStorage?: any;
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
            app.setBackgroundColor("#EFEFF3");

            app.enableClosingConfirmation();

            app?.MainButton.setParams({
                text: "Share with friends",
                color: "#3b82f6",
                is_active: true,
                is_visible: false,
            });

            app?.SettingsButton.show();
            app?.SettingsButton.onClick(() => {
                hapticFeedback()
                router.push("/settings");
            });

            app?.BackButton.onClick(() => {
                app?.BackButton.hide();
                // router.back();
                hapticFeedback()
                router.push("/esims"); //TODO: check router.back() and replace with it if it works
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
                  unsafeData: webApp?.initDataUnsafe,
                  user: webApp?.initDataUnsafe.user,
                  start_param: webApp?.initDataUnsafe.start_param,
                  cloudStorage: webApp?.cloudStorage,
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
