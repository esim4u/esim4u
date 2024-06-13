"use client";

import React, { useCallback, useEffect } from "react";
import { useTelegram } from "@/providers/telegram-provider";

import { hapticFeedback, shareRef } from "@/lib/utils";
import useReferralLink from "@/hooks/useRefLink";

type Props = {};

const Donation = (props: Props) => {
    const { user: tgUser, webApp } = useTelegram();
    useReferralLink(webApp, tgUser);

    return <div>Donation</div>;
};

export default Donation;
