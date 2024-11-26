"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import confettiAnim from "@/assets/anim/confetti.json";
import { getOrderById } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";
import Lottie from "lottie-react";

import Loader from "@/components/ui/loader";
import SubscribeBanner from "@/components/shared/subscribe-banner";

export default function Success() {
    const lottieRef = useRef<any>();

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
            <div className="z-0 flex h-full flex-col items-center justify-center gap-28">
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
            <div className="z-20 my-4 flex h-fit flex-col items-center justify-center gap-4">
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
