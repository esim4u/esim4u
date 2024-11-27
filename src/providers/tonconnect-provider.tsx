"use client";

import React, { useMemo } from "react";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

const TonConnectProvider = ({ children }: { children: React.ReactNode }) => {
	const manifestUrl = useMemo(() => {
		return new URL(
			"tonconnect-manifest.json",
			window.location.href
		).toString();
	}, []);

	return (
		<TonConnectUIProvider manifestUrl={manifestUrl}>
			{children}
		</TonConnectUIProvider>
	);
};

export default TonConnectProvider;
