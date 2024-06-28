"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import confettiAnim from "@/assets/anim/confetti.json";
import { useTelegram } from "@/providers/telegram-provider";
import { getOrderById } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Lottie from "lottie-react";
import { FaRegCircleCheck } from "react-icons/fa6";

import { getAccentColor, hapticFeedback } from "@/lib/utils";

import Loader from "@/components/ui/loader";
import SubscribeBanner from "@/components/shared/subscribe-banner";

export default function Success() {
    const lottieRef = useRef<any>();

    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();
    const searchParams = useSearchParams();
    const order_id = searchParams.get("order_id");
    const [isPageLoading, setIsPageLoading] = useState(true);

    const { data: orderData, isLoading } = useQuery({
        queryKey: ["order", order_id],
        queryFn: async () => {
            const data = await getOrderById(order_id);
            return data;
        },
        enabled: !!order_id,
    });

    const copyReferralLink = useCallback(() => {
        if (webApp) {
            hapticFeedback("success");
            router.push("/profile?is_payment=true");
        }
    }, [webApp, tgUser]);

    useEffect(() => {
        if (webApp) {
            webApp?.BackButton.hide();
            webApp?.onEvent("mainButtonClicked", copyReferralLink);

            setTimeout(() => {
                setIsPageLoading(false);
            }, 4000);

            setTimeout(() => {
                router.push("/profile?is_payment=true");
            }, 16000);
            return () => {
                webApp?.offEvent("mainButtonClicked", copyReferralLink);
            };
        }
    }, [webApp]);

    useEffect(() => {
        if (webApp) {
            if (!isLoading && !isPageLoading) {
                webApp?.MainButton.setParams({
                    text: "Go to my eSims",
                    color: getAccentColor(),
                    is_active: true,
                    is_visible: true,
                });
            }
        }
    }, [isLoading, isPageLoading, webApp]);

    if (isLoading || isPageLoading)
        return (
            <main className="flex h-dvh flex-col items-center justify-center overflow-x-hidden ">
                <div className="flex flex-col items-center gap-4">
                    <Loader />
                </div>
            </main>
        );

    return (
        <main className="flex h-dvh flex-col items-center justify-between overflow-x-hidden ">
            <div className="z-0 h-full flex flex-col items-center justify-center gap-28">
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex flex-col  gap-1 text-center">
                        <h2 className="text-5xl font-bold ">Thank u Fren</h2>
                        <p className="font-medium">
                            Your {orderData?.coverage} eSim is waiting for you{" "}
                            <br />
                            Enjoy your trip!
                        </p>
                    </div>
                    <div className=" w-32">
                        <div className=" animate-appear drop-shadow-lg">
                            <Image
                                className="esim-mask bg-neutral-300"
                                src={orderData?.image_url || ""}
                                width={128}
                                height={128}
                                alt="country"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="z-20 h-fit my-4 flex flex-col items-center justify-center gap-4">
                <SubscribeBanner className={"mx-4"} />
            </div>
            <div className="absolute z-10 max-h-dvh w-dvw max-w-96 overflow-hidden">
                <Lottie
                    lottieRef={lottieRef}
                    animationData={confettiAnim}
                    loop={false}
                    className="-mt-12"
                />
            </div>
        </main>
    );
}
