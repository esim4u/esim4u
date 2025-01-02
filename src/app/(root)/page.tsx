"use client";

import authService from "@/features/auth/services/auth.service";
import { TelegramUser } from "@/features/auth/types/auth.types";
import LoadingScreen from "@/features/navigation/components/loading-screen";
import { initData, useLaunchParams, useSignal } from "@telegram-apps/sdk-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
	const router = useRouter();
	const initDataRaw = useSignal(initData.raw);
	const initDataState = useSignal(initData.state);
	const lp = useLaunchParams();

	useEffect(() => {
		if (!initDataRaw) return;
		if (!initDataState) return;
		if (!lp) return;

		const fetchData = async (tgUser: TelegramUser) => {
			const data = await authService.auth(tgUser);

			if (data.isNew) {
				router.push("/onboarding");
			} else {
				router.push("/esims");
			}
		};

		if (initDataState.user && lp) {
			const tgUser: TelegramUser = {
				...initDataState.user,
				startParam: initDataState.startParam,
				platform: lp?.platform,
			};
			fetchData(tgUser);
		}
	}, [initDataRaw, initDataState, lp]);

	return <LoadingScreen />;
}
