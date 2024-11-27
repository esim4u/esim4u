"use client";

import React from "react";
import TelegramProvider from "./telegram-provider";
import { useDidMount } from "@/hooks/use-did-mount";
import ReactQueryProvider from "./query-provider";
import TonConnectProvider from "./tonconnect-provider";

type Props = {
	children: React.ReactNode;
};

const MainProvider = ({ children }: Props) => {
	// Unfortunately, Telegram Mini Apps does not allow us to use all features of
	// the Server Side Rendering. That's why we are showing loader on the server
	// side.
	const didMount = useDidMount();
	if (!didMount) {
		return (
			<main className="container py-5 bg-white h-screen">
				<div>Loading...</div>
			</main>
		);
	}
	return (
		<ReactQueryProvider>
			<TelegramProvider>
				<TonConnectProvider>{children}</TonConnectProvider>
			</TelegramProvider>
			;
		</ReactQueryProvider>
	);
};

export default MainProvider;
