"use client";

import { Button } from "@/components/ui/button";
import { hapticFeedback } from "@/lib/utils";
import { useTelegram } from "@/providers/telegram-provider";
import { getUserById } from "@/services/supabase";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Settings() {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();

    const { data: dbUserData, isLoading } = useQuery({
        queryKey: ["user", tgUser?.id],
        queryFn: async () => {
            const data = await getUserById(tgUser.id);
            return data;
        },
    });

    useEffect(() => {
        if (webApp) {
            webApp?.BackButton.show();
        }
    }, [webApp]);

    return (
        <main className="overflow-x-hidden h-dvh flex flex-col justify-center items-center ">
            <div className="flex flex-col items-center gap-4">
                <h2>Settings page</h2>

                {["developer", "admin"].includes(
                    dbUserData?.badge.toLowerCase()
                ) && (
                    <Button
                        onClick={() => {
                            hapticFeedback();
                            router.push("/profile/sensitive-info");
                        }}
                        variant={"destructive"}
                        className="rounded-full"
                    >
                        Sensitive info
                    </Button>
                )}

                <Button
                    onClick={() => {
                        hapticFeedback();
                        router.push("/sandbox");
                    }}
                    variant={"destructive"}
                    className="rounded-full"
                >
                    Sandbox
                </Button>

                <Button
                    onClick={() => {
                        hapticFeedback();
                        router.push("/onboarding");
                    }}
                    variant={"destructive"}
                    className="rounded-full"
                >
                    Repeat onboarding
                </Button>

                <Button
                    onClick={() => {
                        webApp?.openTelegramLink('https://t.me/esim4u_support_bot/chat');
                    }}
                    className="rounded-full"
                >
                    open support
                </Button>
            </div>
        </main>
    );
}
