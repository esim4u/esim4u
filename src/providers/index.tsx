"use client";

import React from "react";
import TelegramProvider from "./telegram-provider";
import { useDidMount } from "@/hooks/use-did-mount";
import ReactQueryProvider from "./query-provider";
import TonConnectProvider from "./tonconnect-provider";
import LoadingScreen from "@/features/navigation/components/loading-screen";

type Props = {
	children: React.ReactNode;
};

const MainProvider = ({ children }: Props) => {
	// Unfortunately, Telegram Mini Apps does not allow us to use all features of
	// the Server Side Rendering. That's why we are showing loader on the server
	// side.
	const didMount = useDidMount();

	if (!didMount) {
		return <LoadingScreen />;
	}

	return (
		<ReactQueryProvider>
			<TelegramProvider>
				<TonConnectProvider>{children}</TonConnectProvider>
			</TelegramProvider>
		</ReactQueryProvider>
	);
};

export default MainProvider;
