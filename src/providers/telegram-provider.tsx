"use client";

import { debug } from "console";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { ITelegramUser, IWebApp } from "@/types";

import { initLanguage, l, setLanguage } from "@/lib/locale";
import { hapticFeedback } from "@/lib/utils";

export interface ITelegramContext {
    webApp?: any;
    user?: any;
    start_param?: string | number;
    cloudStorage?: any;
    // webApp?: IWebApp;
    // user?: ITelegramUser;
    // adContoller?: any;
}

export const TelegramContext = createContext<ITelegramContext>({});

export const TelegramProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const router = useRouter();
    const path = usePathname();

    const [webApp, setWebApp] = useState<any>(null);

    useEffect(() => {
        const app = (window as any).Telegram?.WebApp;

        if (app) {
            app.setHeaderColor("#EFEFF3");
            app.setBackgroundColor("#EFEFF3");

            app.enableClosingConfirmation();

            initLanguage(app.initDataUnsafe?.user?.language_code);

            app?.MainButton.setParams({
                text: l("btn_main_share"),
                color: "#3b82f6",
                is_active: true,
                is_visible: false,
            });

            app?.SettingsButton.show();
            app?.SettingsButton.onClick(() => {
                hapticFeedback();
                router.push("/settings");
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
                  user: {
                      ...webApp?.initDataUnsafe.user,
                      platform: webApp?.platform,
                  },
                  start_param: webApp?.initDataUnsafe.start_param,
                  cloudStorage: webApp?.cloudStorage,
                  //   adContoller
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
