"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTelegram } from "@/providers/telegram-provider";
import { getOrderById } from "@/services/supabase";
import { sendTgLog } from "@/services/tg-logger";
import { createTransaction } from "@/services/tonconnect";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import axios from "axios";
import { BiLoaderAlt } from "react-icons/bi";
import { MdArrowForwardIos } from "react-icons/md";

import { l } from "@/lib/locale";
import { cn, hapticFeedback, shareRef } from "@/lib/utils";
import useReferralLink from "@/hooks/useRefLink";

import { Button } from "@/components/ui/button";
import Collapse from "@/components/ui/collapse";
import Dot from "@/components/ui/dot";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { TonIcon } from "@/components/icons";

const TonPayment = dynamic(() => import("@/components/payment/ton-payment"), {
    ssr: false,
});

export function Payment({ params }: { params: { order_id: string } }) {
    const { user: tgUser, webApp } = useTelegram();
    useReferralLink(webApp, tgUser);

    const { data: orderData, isLoading } = useQuery({
        queryKey: ["order", params.order_id],
        queryFn: async () => {
            const data = await getOrderById(params.order_id);
            return data;
        },
        refetchInterval: 1000 * 10, // 10 sec
    });

    useEffect(() => {
        if (webApp) {
            webApp?.BackButton.show();
            webApp?.MainButton.setParams({
                text: l("btn_main_share"),
                color: "#3b82f6",
                is_active: true,
                is_visible: true,
            });
        }
    }, [webApp]);

    return (
        <main className="flex min-h-dvh flex-col items-start overflow-x-hidden ">
            <div className="flex w-full flex-col items-center gap-4 p-5 ">
                <OrderDataItem
                    orderData={orderData}
                    isOrderDataLoading={isLoading}
                />
                <TonPayment orderData={orderData} />

                <CardPayment orderData={orderData} />
            </div>
        </main>
    );
}

const OrderDataItem = ({
    orderData,
    isOrderDataLoading,
}: {
    orderData: any;
    isOrderDataLoading: boolean;
}) => {
    if (isOrderDataLoading) {
        return (
            <div className="flex h-12 w-full items-center justify-between rounded-xl bg-white px-4 py-3">
                <div className="flex items-center gap-2 text-sm">
                    <Skeleton className=" h-6 w-9"></Skeleton>
                    <Skeleton className=" h-5 w-28"></Skeleton>
                </div>
                <Skeleton className=" h-5 w-20"></Skeleton>
            </div>
        );
    }

    return (
        <div className="flex h-12 w-full items-center justify-between rounded-xl bg-white px-4 py-3">
            <div className="flex items-center gap-1 text-sm">
                <Image
                    className="  overflow-hidden rounded-md object-contain"
                    src={orderData?.image_url || ""}
                    width={32}
                    height={32}
                    alt="country"
                />
                <span className="">
                    {orderData?.coverage} <span className="text-xs">|</span>{" "}
                    {orderData?.data} <span className="text-xs">|</span>{" "}
                    {orderData?.validity} days
                </span>
            </div>

            <div className="flex items-center gap-1">
                <h2 className="font-bold">
                    {orderData?.price?.total}
                    <span className=" text-sm">$</span>
                </h2>
                <Dot className="h-1.5 w-1.5" />
                <h2 className="flex items-center font-bold">
                    {orderData?.price?.total_ton}
                    <TonIcon className="h-3 w-3 " />
                </h2>
            </div>
        </div>
    );
};

const CardPayment = ({ orderData }: { orderData: any }) => {
    const router = useRouter();

    const [isCardPaymentOpen, setIsCardPaymentOpen] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (orderData && orderData.checkout_id) {
            setIsLoading(true);
            (window as any).SumUpCard?.mount({
                id: "sumup-card",
                checkoutId: orderData.checkout_id,
                showFooter: false,
                onResponse: async function (type: any, body: any) {
                    if (type == "success" && body && body.status == "PAID") {
                        router.push("/esims/pay/pending");
                    } else if (body && body.status == "FAILED") {
                        toast({
                            variant: "destructive",
                            title: "Error. Payment failed.",
                        });
                    } else {
                        console.log(type, body);
                    }

                    await sendTgLog(JSON.stringify(type, null, 2));
                    await sendTgLog(JSON.stringify(body, null, 2));
                },
                onLoad: function () {
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 1000);
                },
            });
        }
    }, [orderData]);

    return (
        <div className="w-full rounded-2xl bg-white">
            <div
                className="z-10 flex w-full cursor-pointer items-center justify-between px-6 py-2"
                onClick={() => {
                    hapticFeedback();
                    setIsCardPaymentOpen(!isCardPaymentOpen);
                }}
            >
                <h2 className="flex cursor-pointer items-center gap-1 text-xs font-medium uppercase text-neutral-500">
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
                        isCardPaymentOpen && " rotate-90",
                    )}
                />
            </div>
            <Collapse isOpen={isCardPaymentOpen}>
                <div className={cn("-mt-14")}>
                    <div
                        className={cn(
                            " flex h-[450px] w-full flex-col justify-between gap-2 rounded-2xl p-6 pt-16",
                            !isLoading && "hidden",
                        )}
                    >
                        <div className="flex flex-col gap-2">
                            <Skeleton className="h-4 w-full"></Skeleton>
                            <Skeleton className="h-4 w-full"></Skeleton>
                            <Skeleton className="h-10 w-full"></Skeleton>
                            <Skeleton className="h-4 w-full"></Skeleton>
                            <Skeleton className="h-10 w-full"></Skeleton>
                            <Skeleton className="h-10 w-full"></Skeleton>
                            <Skeleton className="h-4 w-full"></Skeleton>
                            <Skeleton className="h-10 w-full"></Skeleton>
                        </div>
                        <Skeleton className="h-10 w-full"></Skeleton>
                    </div>
                    <div
                        className={cn(isLoading && "hidden")}
                        id="sumup-card"
                    ></div>
                </div>
            </Collapse>
        </div>
    );
};
