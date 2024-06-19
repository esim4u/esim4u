"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTelegram } from "@/providers/telegram-provider";
import { sendTgLog } from "@/services/tg-logger";
import { createTransaction } from "@/services/tonconnect";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
    TonConnectButton,
    useTonAddress,
    useTonConnectUI,
} from "@tonconnect/ui-react";
import axios from "axios";
import { BiLoaderAlt } from "react-icons/bi";

import { hapticFeedback, tonPaymentErrorToast } from "@/lib/utils";

import { TonIcon } from "../icons";
import { Button } from "../ui/button";
import TCButton from "../ui/tc-button";

const TonPayment = ({ orderData }: { orderData: any }) => {
    const router = useRouter();
    const [tonConnectUI, setOptions] = useTonConnectUI();

    const { webApp } = useTelegram();

    const rawAddress = useTonAddress();

    const { data: rateTonUsd } = useQuery({
        queryKey: ["ratetonusd"],
        queryFn: async () => {
            const { data } = await axios.get(
                "https://tonapi.io/v2/rates?tokens=ton&currencies=usd",
            );

            return data.rates.TON.prices.USD;
        },
        refetchInterval: 1000 * 10, // 10 sec
    });

    const tonPayment = useMutation({
        mutationFn: async (transaction: any) => {
            return await tonConnectUI.sendTransaction(transaction);
        },
        onSuccess: (data) => {
            if (data.boc) {
                pay.mutate(data.boc);
                sendTgLog(JSON.stringify(data));
            }
        },
        onError: (error) => {
            console.log(error);
            sendTgLog(JSON.stringify(error));
        },
    });

    const pay = useMutation({
        mutationFn: async (boc: string) => {
            return await axios.post(
                "/api/pay/tonconnect",
                {
                    order_id: orderData.id,
                    boc: boc,
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_ESIM4U_ACCESS_TOKEN}`,
                    },
                },
            );
        },
        onSuccess: (data) => {
            router.push("/esims/pay/pending");
        },
        onError: (error) => {
            tonPaymentErrorToast();
            console.log(error);
        },
    });

    const currentPriceInTon = useMemo(() => {
        if (orderData && orderData?.price?.total && rateTonUsd) {
            return orderData.price.total / rateTonUsd;
        }
        return 99999;
    }, [orderData, rateTonUsd]);

    const transaction = useMemo(() => {
        if (orderData && orderData?.price?.total && rateTonUsd) {
            return createTransaction(currentPriceInTon, `t.me/esim4u_bot - Experience seamless connectivity`);
        }
        return null;
    }, [orderData, rateTonUsd]);

    const handlePayButtonClick = async () => {
        if (transaction) {
            tonPayment.mutate(transaction);
        }
    };

    return (
        <>
            <div className="flex w-full flex-col items-start gap-4 rounded-2xl bg-white p-6">
                <div className="flex flex-row items-center  gap-1">
                    <h2 className="text-center font-bold">Pay with TON</h2>
                    <TonIcon className=" h-4 w-4" />
                </div>
                {!rawAddress ? (
                    <TCButton />
                ) : tonPayment.isPending || pay.isPending ? (
                    <Button className="w-full gap-1 rounded-xl text-base text-white">
                        <BiLoaderAlt className="animate-spin" />
                    </Button>
                ) : (
                    <Button
                        onClick={() => {
                            hapticFeedback("medium");
                            handlePayButtonClick();
                        }}
                        className="w-full gap-1 rounded-xl text-base text-white"
                    >
                        Pay {currentPriceInTon.toFixed(3)}
                        <TonIcon className="h-3 w-3 text-white " />
                    </Button>
                )}
            </div>

            <span className=" text-sm text-neutral-500">or</span>
        </>
    );
};

export default TonPayment;
