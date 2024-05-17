"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserById } from "@/services/supabase";
import { useTelegram } from "@/providers/telegram-provider";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { FaRegCircleCheck } from "react-icons/fa6";

export default function SuccessPage() {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();

    useEffect(() => {
        if (webApp) {
            webApp?.BackButton.show();
        }
    }, [webApp]);

    return (
        <main className="overflow-x-hidden h-dvh flex flex-col justify-center items-center ">
            <div className="flex flex-col items-center gap-4">
                <FaRegCircleCheck className="text-green-500 w-32 h-32 animate-appear" />
            </div>
        </main>
    );
}
