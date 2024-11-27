"use client";

import React from "react";
import TelegramProvider from "./telegram-provider";
import { useDidMount } from "@/hooks/use-did-mount";
import ReactQueryProvider from "./query-provider";
import AuthProvider from "./auth-provider";

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
				<AuthProvider>{children}</AuthProvider>
			</TelegramProvider>
			;
		</ReactQueryProvider>
	);
};

export default MainProvider;
