"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTelegram } from "@/providers/telegram-provider";
import { getOrderById } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FaRegCircleCheck } from "react-icons/fa6";
import Image from "next/image";
import Loader from "@/components/ui/loader";

export default function Success() {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();
    const searchParams = useSearchParams();
    const order_id = searchParams.get("order_id");

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

            // setTimeout(() => {
            //     router.push("/profile?is_payment=true");
            // }, 2000);
        }
    }, [webApp]);

    if(isLoading) return (
        <main className="flex h-dvh flex-col items-center justify-center overflow-x-hidden ">
            <div className="flex flex-col items-center gap-4">
                <Loader />
            </div>
        </main>
    );

    return (
        <main className="flex h-dvh flex-col items-center justify-center overflow-x-hidden ">
            <div className="flex flex-col items-center gap-4">
                <div className="drop-shadow-lg">
                    <Image
                        className="esim-mask"
                        src={orderData?.image_url || ""}
                        width={128}
                        height={128}
                        alt="country"
                    />
                </div>

                {/* <pre>{JSON.stringify(orderData, null, 2)}</pre> */}
            </div>
        </main>
    );
}
