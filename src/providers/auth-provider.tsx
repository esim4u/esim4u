"use client";
import authService from "@/services/auth.service";
import { TelegramUser } from "@/types/auth.types";
import { useSignal, initData, useLaunchParams } from "@telegram-apps/sdk-react";
import { useEffect } from "react";

type Props = {
	children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
	const initDataRaw = useSignal(initData.raw);
	const initDataState = useSignal(initData.state);
	const lp = useLaunchParams();

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
			authService.auth(tgUser);
		}
	}, [initDataRaw, initDataState, lp]);

	return children;
};

export default AuthProvider;
