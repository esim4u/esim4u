"use client";

import React, { useEffect } from "react";
import { useTelegram } from "@/providers/telegram-provider";
import { disconnectUserWallet, updateUserWallet } from "@/services/supabase";
import { TonConnectButton, useTonAddress } from "@tonconnect/ui-react";

type Props = {};

const TCButton = (props: Props) => {
    const { user: tgUser, webApp } = useTelegram();

    const tonAddress = useTonAddress();

    useEffect(() => {
        const updateWallet = async () => {
            await updateUserWallet(tgUser.id, tonAddress);
        };
        const disconnectWallet = async () => {
            await disconnectUserWallet(tgUser.id);
        };
        if (tgUser?.id && tonAddress) {
            if (tonAddress) {
                updateWallet();
            } else {
                disconnectWallet();
            }
        }
    }, [tonAddress]);
    return <TonConnectButton {...props} />;
};

export default TCButton;
