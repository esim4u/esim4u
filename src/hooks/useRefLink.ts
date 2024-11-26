import { useCallback, useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";
import { track } from "@vercel/analytics/react";

import { shareRef } from "@/lib/utils";

const useReferralLink = (webApp: any, tgUser: any) => {
    const copyReferralLink = useCallback(() => {
        if (webApp) {
            webApp.openTelegramLink(shareRef(tgUser?.id.toString()));
            sendGAEvent({ event: "share", value: "main-share-button-clicked" });
            track("main-share-button-clicked");
        }
    }, [webApp, tgUser]);

    useEffect(() => {
        webApp?.onEvent("mainButtonClicked", copyReferralLink);
        return () => {
            webApp?.offEvent("mainButtonClicked", copyReferralLink);
        };
    }, [webApp, copyReferralLink]);
};

export default useReferralLink;
