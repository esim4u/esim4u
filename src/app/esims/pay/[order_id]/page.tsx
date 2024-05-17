"use client";

import { Checkbox } from "@/components/ui/checkbox";
import Collapse from "@/components/ui/collapse";
import Dot from "@/components/ui/dot";
import { cn, hapticFeedback } from "@/lib/utils";
import { useTelegram } from "@/providers/telegram-provider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { use, useCallback, useEffect, useMemo, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { getOrderById } from "@/services/supabase";
import { Button } from "@/components/ui/button";
import { RiVisaLine } from "react-icons/ri";
import {
    TonConnectButton,
    useTonAddress,
    useTonConnectUI,
    useTonWallet,
} from "@tonconnect/ui-react";
import { createTransaction } from "@/services/tonconnect";
import { sendTgLog } from "@/services/tg-logger";

const PaymentPage = ({ params }: { params: { order_id: string } }) => {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();
    const [isCardPaymentOpen, setIsCardPaymentOpen] = useState(true);
    const [tonConnectUI, setOptions] = useTonConnectUI();
    const wallet = useTonWallet();
    const userFriendlyAddress = useTonAddress();
    const rawAddress = useTonAddress(false);

    const { data: rateTonUsd } = useQuery({
        queryKey: ["ratetonusd"],
        queryFn: async () => {
            const { data } = await axios.get(
                "https://tonapi.io/v2/rates?tokens=ton&currencies=usd"
            );

            return data.rates.TON.prices.USD;
        },
        refetchInterval: 1000 * 10, // 10 sec
    });

    const { data: orderData } = useQuery({
        queryKey: ["order", params.order_id],
        queryFn: async () => {
            const data = await getOrderById(params.order_id);
            return data;
        },
        refetchInterval: 1000 * 10, // 10 sec
    });

    useEffect(() => {
        if (orderData && orderData.sumup_id) {
            (window as any).SumUpCard.mount({
                id: "sumup-card",
                checkoutId: orderData.sumup_id,
                onResponse: async function (type: any, body: any) {
                    if (type == "success" && body && body.status == "PAID") {
                        let success = false;

                        if (body.transactions && body.transactions[0]) {
                            for (const transaction of body.transactions) {
                                if (transaction.status == "SUCCESSFUL") {
                                    success = true;
                                    break;
                                }
                            }
                        }

                        if (success) {
                            router.push("esims/pay/pending");
                        } else {
                        }
                    } else if (body && body.status == "FAILED") {
                    } else {
                        console.log(type, body);
                    }

                    await sendTgLog(JSON.stringify(body, null, 2));
                },
            });
        }
    }, [orderData]);

    useEffect(() => {
        if (webApp) {
            webApp.MainButton.setParams({
                text: "‎",
                color: "#EFEFF3",
                is_active: false,
                is_visible: false,
            });
        }
    }, [webApp]);

    const transaction = useMemo(() => {
        if (orderData && orderData?.price?.total && rateTonUsd) {
            const currentPriceInTon = orderData.price.total / rateTonUsd;
            return createTransaction(currentPriceInTon);
        }
        return null;
    }, [orderData, rateTonUsd]);

    const handlePayButtonClick = async () => {
        if (transaction) {
            if (transaction) {
                const result = await tonConnectUI.sendTransaction(transaction);
                await sendTgLog(JSON.stringify(result, null, 2));
            }
        }
    };

    return (
        <main className="overflow-x-hidden min-h-dvh flex flex-col justify-center items-center ">
            <div className="flex flex-col p-5 gap-4 items-center w-full ">
                {/* <div className="flex flex-col items-center bg-white rounded-2xl p-6 gap-4 w-full">
                    <div className="flex flex-row items-center  gap-1">
                        <h2 className="font-bold text-center">Pay with TON</h2>
                        <svg
                            className=""
                            width="18"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clipPath="url(#clip0_2028_1457)">
                                <path
                                    d="M20.1036 -0.000366211H3.89546C0.91535 -0.000366211 -0.973515 3.21428 0.525777 5.81304L10.5289 23.1512C11.1816 24.2833 12.8175 24.2833 13.4702 23.1512L23.4753 5.81304C24.9726 3.21843 23.0837 -0.000366211 20.1057 -0.000366211H20.1036ZM10.5207 17.9517L8.34222 13.7355L3.08571 4.33417C2.73894 3.73244 3.16725 2.96135 3.89342 2.96135H10.5187V17.9538L10.5207 17.9517ZM20.9093 4.33214L15.6548 13.7376L13.4763 17.9517V2.95931H20.1016C20.8278 2.95931 21.2561 3.7304 20.9093 4.33214Z"
                                    fill="#1B1C1F"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_2028_1457">
                                    <rect width="24" height="24" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                    </div>

                    <div className="flex flex-col items-center gap-2 w-full">
                        <TonConnectButton />

                        <Button
                            onClick={() => {
                                tonConnectUI.openModal();
                            }}
                            className="rounded-xl w-full"
                        >
                            Connect your wallet
                        </Button>

                        <Button
                            onClick={() => {
                                hapticFeedback(webApp);
                                handlePayButtonClick();
                            }}
                            className="rounded-xl w-full"
                        >
                            Pay
                        </Button>

                        {wallet && (
                            <div className=" text-balance break-all">
                                <p>
                                    Connected wallet:{" "}
                                    {wallet.account.address || ""}
                                </p>
                                <p>
                                    Wallet account public key:{" "}
                                    {wallet.account.publicKey || ""}
                                </p>
                                <p>Device: {wallet.device.appName}</p>
                                <p>Device platform: {wallet.device.platform}</p>
                            </div>
                        )}
                        {userFriendlyAddress && (
                            <div className=" text-balance break-all">
                                <p>
                                    User friendly address: {userFriendlyAddress}
                                </p>
                            </div>
                        )}
                        {rawAddress && (
                            <div className=" text-balance break-all">
                                <p>Raw address: {rawAddress}</p>
                            </div>
                        )}
                    </div>
                </div>

                <span className=" text-sm text-neutral-500">or</span> */}

                <div className="bg-white rounded-2xl w-full">
                    <div
                        className="w-full px-6 py-2 cursor-pointer flex items-center justify-between"
                        onClick={() => setIsCardPaymentOpen(!isCardPaymentOpen)}
                    >
                        <h2 className="cursor-pointer flex items-center gap-1 text-xs uppercase font-medium text-neutral-500">
                            <svg
                                enableBackground="new -822 823.1 56.7 56.7"
                                height="44px"
                                id="Layer_1"
                                version="1.1"
                                viewBox="-822 823.1 56.7 56.7"
                                width="44px"
                                fill="#005BAC"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g>
                                    <polygon points="-797.8,845.3 -801.1,860.5 -797.1,860.5 -793.9,845.3  " />
                                    <path d="M-803.6,845.3l-4.1,10.3l-1.7-8.8c-0.2-1-1-1.5-1.8-1.5h-6.7l-0.1,0.4c1.4,0.3,2.9,0.8,3.9,1.3c0.6,0.3,0.7,0.6,0.9,1.3   l3.1,12.1h4.2l6.4-15.2H-803.6z" />
                                    <path d="M-772.5,845.3h-3.4c-0.8,0-1.4,0.4-1.7,1.1l-5.9,14.1h4.1l0.8-2.3h5l0.5,2.3h3.6L-772.5,845.3z M-777.3,855.1l2.1-5.7   l1.2,5.7H-777.3z" />
                                    <path d="M-788.7,849.5c0-0.5,0.5-1.1,1.7-1.3c0.6-0.1,2.1-0.1,3.9,0.7l0.7-3.2c-0.9-0.3-2.2-0.7-3.7-0.7c-3.9,0-6.6,2.1-6.6,5   c0,2.2,2,3.4,3.4,4.1c1.5,0.7,2,1.2,2,1.9c0,1-1.2,1.5-2.4,1.5c-2,0-3.1-0.5-4-1l-0.7,3.3c0.9,0.4,2.6,0.8,4.4,0.8   c4.1,0,6.8-2,6.8-5.2C-783.2,851.6-788.8,851.3-788.7,849.5z" />
                                </g>
                            </svg>

                            <svg
                                enableBackground="new 0 0 32 20"
                                height="16"
                                overflow="visible"
                                viewBox="0 0 32 20"
                                width="32"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g>
                                    <g id="Master_Card_1_">
                                        <g id="Master_Card">
                                            <circle
                                                cx="10"
                                                cy="10"
                                                fill="#F93232"
                                                id="Red_x5F_Circle"
                                                r="10"
                                            />
                                            <path
                                                d="M22,0c-2.246,0-4.312,0.75-5.98,2H16v0.014        C15.604,2.312,15.24,2.648,14.893,3h2.214c0.308,0.313,0.592,0.648,0.855,1H14.03c-0.242,0.319-0.464,0.652-0.667,1h5.264        c0.188,0.324,0.365,0.654,0.518,1h-6.291c-0.143,0.325-0.269,0.658-0.377,1h7.044c0.104,0.326,0.186,0.661,0.258,1h-7.563        c-0.067,0.328-0.123,0.66-0.157,1h7.881C19.979,9.328,20,9.661,20,10h-8c0,0.339,0.027,0.67,0.06,1h7.882        c-0.038,0.339-0.093,0.672-0.162,1h-7.563c0.069,0.341,0.158,0.673,0.261,1h7.044c-0.108,0.342-0.234,0.675-0.377,1h-6.291        c0.151,0.344,0.321,0.678,0.509,1h5.264c-0.202,0.348-0.427,0.681-0.669,1H14.03c0.266,0.352,0.553,0.687,0.862,1h2.215        c-0.348,0.353-0.711,0.688-1.107,0.986C17.672,19.245,19.745,20,22,20c5.523,0,10-4.478,10-10S27.523,0,22,0z"
                                                fill="#FED049"
                                                id="Yellow_x5F_Circle"
                                            />
                                        </g>
                                    </g>
                                </g>
                            </svg>
                        </h2>
                        <MdArrowForwardIos
                            className={cn(
                                "text-neutral-500 transition-transform",
                                isCardPaymentOpen && " rotate-90"
                            )}
                        />
                    </div>
                    <Collapse isOpen={isCardPaymentOpen}>
                        <div className="-mt-14" id="sumup-card"></div>
                    </Collapse>
                </div>
            </div>
        </main>
    );
};

export default PaymentPage;
