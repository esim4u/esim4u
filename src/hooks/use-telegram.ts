import { useMemo } from "react";
import { initData, useLaunchParams, User, useSignal } from "@telegram-apps/sdk-react";
import { TelegramUser } from "@/types/auth.types";

export const useTelegram = () => {
	const initDataState = useSignal(initData.state);
	const lp = useLaunchParams();

	const tgUser: TelegramUser | undefined = useMemo(() => {
		if (!initDataState || !lp) {
			return undefined;
		}
		return {
			...initDataState.user as User,
			startParam: initDataState.startParam,
			platform: lp?.platform,
		};
	}, [initDataState, lp]);

	return {
		tgUser,
	};
};
