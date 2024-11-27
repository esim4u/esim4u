"use client";

import Loader from "@/components/ui/loader";
import { useAuth } from "@/hooks/use-auth";
import { TelegramUser } from "@/types/auth.types";
import { initData, useLaunchParams, useSignal } from "@telegram-apps/sdk-react";
import { useEffect } from "react";

export default function Home() {
	const initDataRaw = useSignal(initData.raw);
	const initDataState = useSignal(initData.state);
	const lp = useLaunchParams();
	const auth = useAuth();

	useEffect(() => {
		if (!initDataRaw) return;
		if (!initDataState) return;
		if (!lp) return;

		if (initDataState.user && lp) {
			const tgUser: TelegramUser = {
				...initDataState.user,
				startParam: initDataState.startParam,
				platform: lp?.platform,
			};
			auth.mutate(tgUser);
		}
	}, [initDataRaw, initDataState, lp]);

	return (
		<main className="container flex h-screen items-center justify-center bg-white py-5">
			<Loader />
		</main>
	);
}
