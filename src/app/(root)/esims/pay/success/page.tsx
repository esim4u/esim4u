"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import confettiAnim from "@/assets/anim/confetti.json";
import { useTelegram } from "@/providers/telegram-provider";
import { getOrderById } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Lottie, { useLottie } from "lottie-react";
import { FaRegCircleCheck } from "react-icons/fa6";

import { hapticFeedback } from "@/lib/utils";

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

    useEffect(() => {
        if (webApp) {
            webApp?.BackButton.hide();

            setTimeout(() => {
                setIsPageLoading(false);
            }, 3000);

            setTimeout(() => {
                router.push("/profile?is_payment=true");
            }, 12000);
        }
    }, [webApp]);

    if (isLoading || isPageLoading)
        return (
            <main className="flex h-dvh flex-col items-center justify-center overflow-x-hidden ">
                <div className="flex flex-col items-center gap-4">
                    <Loader />
                </div>
            </main>
        );

    return (
        <main className="flex h-dvh flex-col items-center justify-center overflow-x-hidden ">
            <div className="z-0 flex flex-col items-center gap-24">
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="text-center">
                        <h2 className="text-5xl font-bold ">Thank u Fren</h2>
                        <h2 className="font-medium">
                            Your eSim is waiting for you!
                        </h2>
                    </div>
                    <div className=" w-32">
                        <div className=" animate-appear drop-shadow-lg">
                            <Image
                                className="esim-mask"
                                src={orderData?.image_url || ""}
                                width={128}
                                height={128}
                                alt="country"
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                    <SubscribeBanner className={"mx-4"} />
                    <div
                        onClick={() => {
                            hapticFeedback("success");
                            router.push("/profile?is_payment=true");
                        }}
                        className="text-2xl font-medium text-blue-500 underline underline-offset-4"
                    >
                        Go to my eSims
                    </div>
                </div>
            </div>
            <Lottie
                lottieRef={lottieRef}
                className="absolute -z-10 w-dvw max-w-96"
                animationData={confettiAnim}
                loop={false}
            />
        </main>
    );
}
