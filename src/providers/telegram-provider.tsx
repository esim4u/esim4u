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
import { get } from "http";
import { getReferralLink, copyText } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

export interface ITelegramContext {
    webApp?: any;
    user?: any;
    start_param?: string | number;
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

    const copyReferralLink = useCallback(() => {
        if (webApp) {
            copyText(
                getReferralLink(webApp?.initDataUnsafe?.user?.id.toString())
            );
        }
    }, [webApp]);

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
                is_visible: true,
            });

            app?.SettingsButton.show();
            app?.SettingsButton.onClick(() => {
                router.push("/settings");
            });

            app?.BackButton.onClick(() => {
                app?.BackButton.hide();
                router.back();
            });

            app.ready();
            app.expand();
            setWebApp(app);
        }
    }, []);

    useEffect(() => {
        webApp?.onEvent("mainButtonClicked", copyReferralLink);
        return () => {
            webApp?.offEvent("mainButtonClicked", copyReferralLink);
        };
    }, [webApp]);

    const value = useMemo(() => {
        return webApp
            ? {
                  webApp,
                  unsafeData: webApp.initDataUnsafe,
                  user: webApp.initDataUnsafe.user,
                  start_params: webApp.initDataUnsafe.start_params,
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
