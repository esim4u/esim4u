import { useCallback, useEffect } from "react";
import { sendGAEvent } from "@next/third-parties/google";

import { hapticFeedback, shareRef } from "@/lib/utils";

const useReferralLink = (webApp: any, tgUser: any) => {
    const copyReferralLink = useCallback(() => {
        if (webApp) {
            hapticFeedback("success");
            webApp.openTelegramLink(shareRef(tgUser?.id.toString()));
            sendGAEvent({ event: "share", value: "main-share-button-clicked" });
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
