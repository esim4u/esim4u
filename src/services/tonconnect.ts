import TonConnect from "@tonconnect/sdk";
import { toNano } from "@ton/core";

export const connector = new TonConnect();

connector.restoreConnection();

export const walletConnectionSource = {
    universalLink: "https://app.tonkeeper.com/ton-connect",
    bridgeUrl: "https://bridge.tonapi.io/bridge",
};

export const createTransaction = (amountInTon: number) => {
    const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
        messages: [
            {
                address: process.env.NEXT_PUBLIC_TON_WALLET || "",
                amount: toNano(amountInTon).toString(),
            },
        ],
    };
    return transaction;
};
