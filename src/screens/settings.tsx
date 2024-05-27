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
            <div className="flex flex-col items-center gap-10">
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
                        router.push("/onboarding");
                    }}
                    variant={"destructive"}
                    className="rounded-full"
                >
                    Repeat onboarding
                </Button>

                <Button
                    onClick={() => {
                        webApp?.openLink("t.me/esim4u_support_bot/chat", {
                            try_instant_view: true,
                        });
                    }}
                    className="rounded-full"
                >
                    openLink 1
                </Button>
                <Button
                    onClick={() => {
                        webApp?.openLink("@esim4u_support_bot/chat", {
                            try_instant_view: true,
                        });
                    }}
                    className="rounded-full"
                >
                    openLink 2
                </Button>

                <Button
                    onClick={() => {
                        webApp?.openTelegramLink(
                            "t.me/esim4u_support_bot/chat"
                        );
                    }}
                    className="rounded-full"
                >
                    openTelegramLink 1
                </Button>
                <Button
                    onClick={() => {
                        webApp?.openTelegramLink("@esim4u_support_bot/chat");
                    }}
                    className="rounded-full"
                >
                    openTelegramLink 2
                </Button>

                <Button className="rounded-full h-14 text-base w-full" asChild>
                    <Link
                        href={"t.me/esim4u_support_bot/chat"}
                        target="_blank"
                    >
                        <svg
                            className=" -ml-1"
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                className="star-1"
                                d="M18.4058 9.75787C18.9766 8.31076 21.0246 8.31076 21.5953 9.75787L23.768 15.2668C23.9423 15.7087 24.292 16.0584 24.7338 16.2326L30.2428 18.4053C31.6899 18.9761 31.6899 21.0241 30.2428 21.5948L24.7338 23.7675C24.292 23.9418 23.9423 24.2915 23.768 24.7333L21.5953 30.2423C21.0246 31.6894 18.9766 31.6894 18.4058 30.2423L16.2331 24.7333C16.0589 24.2915 15.7091 23.9418 15.2673 23.7675L9.75836 21.5948C8.31125 21.0241 8.31125 18.9761 9.75836 18.4053L15.2673 16.2326C15.7091 16.0584 16.0589 15.7087 16.2331 15.2668L18.4058 9.75787Z"
                                fill="white"
                            />
                            <path
                                className="star-2"
                                d="M5.98121 6.41783C6.14101 6.01264 6.71446 6.01264 6.87426 6.41783L7.48262 7.96034C7.53141 8.08405 7.62933 8.18197 7.75304 8.23076L9.29555 8.83912C9.70074 8.99892 9.70074 9.57237 9.29555 9.73217L7.75304 10.3405C7.62933 10.3893 7.53141 10.4872 7.48262 10.6109L6.87426 12.1535C6.71446 12.5587 6.14101 12.5587 5.98121 12.1535L5.37285 10.6109C5.32406 10.4872 5.22614 10.3893 5.10243 10.3405L3.55992 9.73217C3.15473 9.57237 3.15473 8.99892 3.55992 8.83912L5.10243 8.23076C5.22614 8.18197 5.32406 8.08405 5.37285 7.96034L5.98121 6.41783Z"
                                fill="white"
                            />
                            <path
                                className="star-3"
                                d="M7.18958 27.1265C7.42929 26.5187 8.28946 26.5187 8.52917 27.1265L9.4417 29.4403C9.51489 29.6258 9.66177 29.7727 9.84733 29.8459L12.1611 30.7584C12.7689 30.9981 12.7689 31.8583 12.1611 32.098L9.84733 33.0105C9.66177 33.0837 9.51489 33.2306 9.4417 33.4162L8.52917 35.7299C8.28946 36.3377 7.42929 36.3377 7.18958 35.7299L6.27705 33.4162C6.20386 33.2306 6.05698 33.0837 5.87142 33.0106L3.55765 32.098C2.94987 31.8583 2.94987 30.9981 3.55765 30.7584L5.87142 29.8459C6.05698 29.7727 6.20386 29.6258 6.27705 29.4403L7.18958 27.1265Z"
                                fill="white"
                            />
                        </svg>
                        Classi link in new tab 1
                    </Link>
                </Button>
                <Button className="rounded-full h-14 text-base w-full" asChild>
                    <Link
                        href={"@esim4u_support_bot/chat"}
                        target="_blank"
                    >
                        <svg
                            className=" -ml-1"
                            width="40"
                            height="40"
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                className="star-1"
                                d="M18.4058 9.75787C18.9766 8.31076 21.0246 8.31076 21.5953 9.75787L23.768 15.2668C23.9423 15.7087 24.292 16.0584 24.7338 16.2326L30.2428 18.4053C31.6899 18.9761 31.6899 21.0241 30.2428 21.5948L24.7338 23.7675C24.292 23.9418 23.9423 24.2915 23.768 24.7333L21.5953 30.2423C21.0246 31.6894 18.9766 31.6894 18.4058 30.2423L16.2331 24.7333C16.0589 24.2915 15.7091 23.9418 15.2673 23.7675L9.75836 21.5948C8.31125 21.0241 8.31125 18.9761 9.75836 18.4053L15.2673 16.2326C15.7091 16.0584 16.0589 15.7087 16.2331 15.2668L18.4058 9.75787Z"
                                fill="white"
                            />
                            <path
                                className="star-2"
                                d="M5.98121 6.41783C6.14101 6.01264 6.71446 6.01264 6.87426 6.41783L7.48262 7.96034C7.53141 8.08405 7.62933 8.18197 7.75304 8.23076L9.29555 8.83912C9.70074 8.99892 9.70074 9.57237 9.29555 9.73217L7.75304 10.3405C7.62933 10.3893 7.53141 10.4872 7.48262 10.6109L6.87426 12.1535C6.71446 12.5587 6.14101 12.5587 5.98121 12.1535L5.37285 10.6109C5.32406 10.4872 5.22614 10.3893 5.10243 10.3405L3.55992 9.73217C3.15473 9.57237 3.15473 8.99892 3.55992 8.83912L5.10243 8.23076C5.22614 8.18197 5.32406 8.08405 5.37285 7.96034L5.98121 6.41783Z"
                                fill="white"
                            />
                            <path
                                className="star-3"
                                d="M7.18958 27.1265C7.42929 26.5187 8.28946 26.5187 8.52917 27.1265L9.4417 29.4403C9.51489 29.6258 9.66177 29.7727 9.84733 29.8459L12.1611 30.7584C12.7689 30.9981 12.7689 31.8583 12.1611 32.098L9.84733 33.0105C9.66177 33.0837 9.51489 33.2306 9.4417 33.4162L8.52917 35.7299C8.28946 36.3377 7.42929 36.3377 7.18958 35.7299L6.27705 33.4162C6.20386 33.2306 6.05698 33.0837 5.87142 33.0106L3.55765 32.098C2.94987 31.8583 2.94987 30.9981 3.55765 30.7584L5.87142 29.8459C6.05698 29.7727 6.20386 29.6258 6.27705 29.4403L7.18958 27.1265Z"
                                fill="white"
                            />
                        </svg>
                        Classi link in new tab 2
                    </Link>
                </Button>
            </div>
        </main>
    );
}
