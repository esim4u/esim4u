"use client";

import { TonConnectUIProvider } from "@/lib/tonconnect-react";
import React from "react";

const WEB_APP_URL = process.env.NEXT_PUBLIC_WEB_APP_URL;

const TonConnectProvider = ({ children }: { children: React.ReactNode }) => {
	return (
		<TonConnectUIProvider
			manifestUrl={WEB_APP_URL + "/tonconnect-manifest.json"}
		>
			{children}
		</TonConnectUIProvider>
	);
};

export default TonConnectProvider;
