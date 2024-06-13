"use client";

import { use, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTelegram } from "@/providers/telegram-provider";
import { sendTgLog } from "@/services/tg-logger";
import { createTransaction } from "@/services/tonconnect";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import axios from "axios";
import { BiLoaderAlt } from "react-icons/bi";

import { hapticFeedback } from "@/lib/utils";

import { TonIcon } from "../icons";
import { Button } from "../ui/button";

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
            return await axios.post("/api/pay/tonconnect", {
                order_id: orderData.id,
                boc: boc,
            });
        },
        onSuccess: (data) => {
            router.push("/esims/pay/pending");
        },
        onError: (error) => {
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
            return createTransaction(currentPriceInTon);
        }
        return null;
    }, [orderData, rateTonUsd]);

    const handlePayButtonClick = async () => {
        if (transaction) {
            tonPayment.mutate(transaction);
        }
    };

    if (!rawAddress) {
        return <></>;
    }
    return (
        <>
            <div className="flex flex-col items-start bg-white rounded-2xl p-6 gap-4 w-full">
                <div className="flex flex-row items-center  gap-1">
                    <h2 className="font-bold text-center">Pay with TON</h2>
                    <TonIcon className=" w-4 h-4" />
                </div>

                {tonPayment.isPending || pay.isPending ? (
                    <Button className="w-full rounded-xl text-white gap-1 text-base">
                        <BiLoaderAlt className="animate-spin" />
                    </Button>
                ) : (
                    <Button
                        onClick={() => {
                            hapticFeedback("medium");
                            handlePayButtonClick();
                        }}
                        className="w-full rounded-xl text-white gap-1 text-base"
                    >
                        Pay {currentPriceInTon.toFixed(3)}
                        <TonIcon className="text-white w-3 h-3 " />
                    </Button>
                )}
            </div>

            <span className=" text-sm text-neutral-500">or</span>
        </>
    );
};

export default TonPayment;
