"use client";

import React, { Suspense } from "react";
import { useRouter } from "next/navigation";
import { useTelegram } from "@/providers/telegram-provider";

import { l, resetLanguage } from "@/lib/locale";
import { cn, hapticFeedback } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import CircleProgressBar from "@/components/ui/circle-progress";
import Loader from "@/components/ui/loader";
import { Skeleton } from "@/components/ui/skeleton";
import UserEsims from "@/components/esims/user-esims";
import RefLinkButton from "@/components/shared/ref-link-button";

type Props = {};

const SandboxPage = (props: Props) => {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();

    const [percent, setPercent] = React.useState(50);

    return (
        <div className="flex w-full flex-col gap-4 p-20">
            <CircleProgressBar percent={percent}>
                <span>10Gb</span>
            </CircleProgressBar>
            <Loader />

            <RefLinkButton />
            <Button
                onClick={() => {
                    webApp?.switchInlineQuery("hello", {
                        choose_chat_types: "users",
                    });
                }}
            >
                switch share
            </Button>
            <Button
                onClick={() => {
                    webApp?.switchInlineQuery("hello", {
                        choose_chat_types: ["users"],
                    });
                }}
            >
                switch share array
            </Button>
            <Button
                onClick={() => {
                    webApp?.switchInlineQuery("hello", {
                        choose_chat_types: true,
                    });
                }}
            >
                switch share bool
            </Button>
            <Button
                onClick={() => {
                    webApp?.switchInlineQuery("hello", ["users"]);
                }}
            >
                switch share no object
            </Button>
            <Button
                onClick={() => {
                    webApp?.openLink("awdawd", {
                        try_instant_view: true,
                    });
                }}
            >
                openlink
            </Button>

            <Button
                onClick={() => {
                    resetLanguage(router);
                }}
            >
                reset language
            </Button>

            <Button
                onClick={() => {
                    webApp?.openLink(
                        `https://t.me/share?url=https://core.telegram.org/api/links#share-links&text=shareandgetrewards`,
                        {
                            try_instant_view: true,
                        },
                    );
                }}
            >
                openLink alt
            </Button>

            <Button
                onClick={() => {
                    webApp?.openTelegramLink(
                        `https://t.me/share?url=https://core.telegram.org/api/links#share-links&text=shareandgetrewards`,
                    );
                }}
            >
                openTelegramLink alt
            </Button>

            <a
                onClick={() => {
                    hapticFeedback();
                }}
                href={`https://t.me/share?url=https://core.telegram.org/api/links#share-links&text=shareandgetrewards`}
            >
                https://t.me share
            </a>

            <a
                onClick={() => {
                    hapticFeedback();
                }}
                href={`tg://msg_url?url=https://core.telegram.org/api/links#share-links&text=shareandgetrewards`}
            >
                tg://msg_url share
            </a>

            <Button
                onClick={async () => {
                    const shareData = {
                        title: "Esim 4U",
                        text: "Share this order to pay!",
                        url:
                            "https://t.me/esim4u_bot/app?startapp=" +
                            tgUser?.id,
                    };
                    await navigator.share(shareData);
                }}
            >
                Share
            </Button>

            {l("hello_world")}
            <Suspense fallback={<div></div>}>
                <UserEsims />
            </Suspense>
            <div>
                <Carousel className="w-full">
                    <CarouselContent className={cn("-ml-1")}>
                        {Array(4)
                            .fill(null)
                            .map((placeholder, index) => {
                                return (
                                    <CarouselItem
                                        key={index}
                                        className="basis-24  cursor-pointer pl-1 transition-transform active:scale-95"
                                    >
                                        <div className="p-1">
                                            <div
                                                className={cn(
                                                    "rounded-full p-1 transition-all",
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "relative  flex aspect-square items-end justify-center overflow-hidden rounded-full ring-2 ring-[#EFEFF3] ",
                                                    )}
                                                >
                                                    <Skeleton className="h-full w-full" />
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                );
                            })}
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    );
};

export default SandboxPage;
