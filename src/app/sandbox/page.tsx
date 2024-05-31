"use client";

import EsimCard from "@/components/esims/esim-card";
import UserEsims from "@/components/esims/user-esims";
import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import CircleProgressBar from "@/components/ui/circle-progress";
import { Skeleton } from "@/components/ui/skeleton";
import { ESIM_STATE } from "@/enums";
import { l, resetLanguage, setLanguage } from "@/lib/locale";
import { cn } from "@/lib/utils";
import { useTelegram } from "@/providers/telegram-provider";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const SandboxPage = (props: Props) => {
    const router = useRouter();
    const { webApp } = useTelegram();

    const [percent, setPercent] = React.useState(50);

    return (
        <div className="p-20 flex flex-col gap-4 w-full">
            <CircleProgressBar percent={percent}>
                <span>10Gb</span>
            </CircleProgressBar>

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
                onClick={async () => {
                    
                    const shareData = {
                        title: "Vignette ID",
                        text: "Share this order to pay!",
                        url: "awdawdawd"
                    };
                    await navigator.share(shareData);
                }}
            >
                Share
            </Button>

            {l("hello_world")}
            <UserEsims />
            <div>
                <Carousel className="w-full">
                    <CarouselContent className={cn("-ml-1")}>
                        {Array(4)
                            .fill(null)
                            .map((placeholder, index) => {
                                return (
                                    <CarouselItem
                                        key={index}
                                        className="pl-1  basis-24 active:scale-95 transition-transform cursor-pointer"
                                    >
                                        <div className="p-1">
                                            <div
                                                className={cn(
                                                    "p-1 rounded-full transition-all"
                                                )}
                                            >
                                                <div
                                                    className={cn(
                                                        "relative  aspect-square flex justify-center items-end rounded-full overflow-hidden ring-2 ring-[#EFEFF3] "
                                                    )}
                                                >
                                                    <Skeleton className="w-full h-full" />
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                );
                            })}
                    </CarouselContent>
                </Carousel>
            </div>
            {/* <EsimCard
                iccid={"89852350923520031607"}
                coverage={"12"}
                state={ESIM_STATE.NOT_ACTIVE}
                usage={{
                    total: 1024,
                    remaining: 1024,
                }}
            /> */}
        </div>
    );
};

export default SandboxPage;
