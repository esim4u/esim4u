import { useMemo } from "react";
import { initData, useLaunchParams, useSignal } from "@telegram-apps/sdk-react";

export const useTelegram = () => {
    const initDataState = useSignal(initData.state);
    const lp = useLaunchParams();

    const tgUser = useMemo(() => {
        if (!initDataState || !lp) {
            return null;
        }
        return {
            ...initDataState.user,
            startParam: initData.startParam,
            platform: lp?.platform,
        };
    }, [initDataState, lp]);

    return {
        tgUser,
    };
};
