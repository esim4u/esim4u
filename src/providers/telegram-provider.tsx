"use client";

import { useEffect } from "react";
import {
    backButton,
    init,
    initData,
    miniApp,
    themeParams,
    useLaunchParams,
    viewport,
} from "@telegram-apps/sdk-react";

import { useTelegramMock } from "@/hooks/use-telegram-mock";

type Props = {
    children: React.ReactNode;
};

const TelegramProvider = ({ children }: Props) => {
    if (process.env.NODE_ENV === "development") {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useTelegramMock();
    }

    useEffect(() => {
        init();

        if (backButton.isSupported()) {
            backButton.mount();
        }
        miniApp.mount();
        themeParams.mount();
        initData.restore();
        viewport
            .mount()
            .catch(console.error)
            .then(() => {
                if (!viewport.isCssVarsBound()) {
                    viewport.bindCssVars();
                }
            });

        // Initial configuration
        miniApp.setBackgroundColor("#EFEFF3");
        miniApp.setHeaderColor("#EFEFF3");
        viewport.expand();

        // Define components-related CSS variables.
        if (!miniApp.isCssVarsBound()) {
            miniApp.bindCssVars();
        }
        if (!themeParams.isCssVarsBound()) {
            themeParams.bindCssVars();
        }
    }, []);

    return children;
};

export default TelegramProvider;
