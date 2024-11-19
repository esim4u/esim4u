"use client";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";

import { initLanguage, l } from "@/lib/locale";
import { getAccentColor, hapticFeedback } from "@/lib/utils";
import Script from "next/script";

export interface ITelegramContext {
    webApp?: any;
    user?: any;
    start_param?: string | number;
    cloudStorage?: any;
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
        app.setHeaderColor("#EFEFF3");
        app.setBackgroundColor("#EFEFF3");

        if (app) {
            app.enableClosingConfirmation();
            app.requestFullscreen()
            initLanguage(app.initDataUnsafe?.user?.language_code);

            app?.MainButton.setParams({
                text: l("btn_main_share"),
                color: getAccentColor(),
                is_active: true,
                is_visible: false,
            });

            app?.SettingsButton.show();
            app?.SettingsButton.onClick(() => {
                hapticFeedback();
                router.push("/settings");
            });

            app?.disableVerticalSwipes();
            app.ready();
            // app.expand();
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
            <Script
                src="https://telegram.org/js/telegram-web-app.js"
                strategy="beforeInteractive"
            />
            {children}
        </TelegramContext.Provider>
    );
};

export const useTelegram = () => useContext(TelegramContext);
