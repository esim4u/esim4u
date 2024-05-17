"use client";

import React from "react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

const WEB_APP_URL = process.env.NEXT_PUBLIC_WEB_APP_URL;

const TonConnectProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <TonConnectUIProvider manifestUrl={WEB_APP_URL + "tonconnect-manifest.json"}>
            {children}
        </TonConnectUIProvider>
    );
};

export default TonConnectProvider;
