import { toNano } from "@ton/core";
import { beginCell } from "@ton/ton";
import TonConnect from "@tonconnect/sdk";

export const connector = new TonConnect();

connector.restoreConnection();

export const walletConnectionSource = {
    universalLink: "https://app.tonkeeper.com/ton-connect",
    bridgeUrl: "https://bridge.tonapi.io/bridge",
};

export const createTransaction = (
    amountInTon: number,
    comment: string = "",
) => {
    const body = beginCell()
        .storeUint(0, 32) // write 32 zero bits to indicate that a text comment will follow
        .storeStringTail(comment) // write our text comment
        .endCell();

    const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 60, // 60 sec
        messages: [
            {
                address: process.env.NEXT_PUBLIC_TON_WALLET || "",
                amount: toNano(amountInTon).toString(),
                payload: body.toBoc().toString("base64")
            },
        ],
    };
    return transaction;
};
