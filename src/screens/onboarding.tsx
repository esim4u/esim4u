"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RUNNING_LINE_COUNTRIES } from "@/constants";
import { createUser, finishOnboarding } from "@/services/supabase";
import { useMutation } from "@tanstack/react-query";
import {
    TonConnectButton,
    useTonAddress,
    useTonWallet,
} from "@tonconnect/ui-react";
import ReactCountryFlag from "react-country-flag";

import { l } from "@/lib/locale";
import { cn, hapticFeedback, showConfirmationToast } from "@/lib/utils";
import { useTelegram } from "@/hooks/use-telegram";

import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import Dot from "@/components/ui/dot";
import PopularCountries from "@/components/shared/popular-countries";

export default function OnBoarding() {
    const router = useRouter();
    const wallet = useTonWallet();
    const tonAddress = useTonAddress();

    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });
    }, [api]);

    const createAppUser = useMutation({
        mutationFn: async (tgUser: any) => {
            return await createUser(tgUser, tgUser.start_param);
        },
        onError: (error) => {},
        onSuccess: (data) => {},
    });

    const finishOnboaringForUser = useMutation({
        mutationFn: async (tgUser: any) => {
            return await finishOnboarding(tgUser.id, tonAddress);
        },
        onError: (error) => {},
        onSuccess: (data) => {},
    });

    const { tgUser } = useTelegram();

    useEffect(() => {
        if (tgUser) {
            createAppUser.mutate(tgUser);
        }
    }, [tgUser]);

    return (
        <main className="container flex h-dvh flex-col justify-center overflow-x-hidden">
            <div className="flex h-full flex-col justify-between gap-5 pb-5 pt-[10dvh]">
                <Carousel setApi={setApi} className="w-full">
                    <CarouselContent className=" py-5">
                        <CarouselItem className="flex w-full flex-col items-center">
                            <div className="flex flex-col gap-5 p-5">
                                <h2 className=" text-center text-4xl font-medium">
                                    {l("onboarding_title_1")}
                                </h2>
                                <p className="text-center text-neutral-500">
                                    {l("onboarding_description_1")}
                                </p>
                                <PopularCountries
                                    hasTitle={false}
                                    interactive={false}
                                />
                            </div>
                        </CarouselItem>
                        <CarouselItem className="flex  w-full flex-col  items-center overflow-hidden">
                            <div className="flex flex-col gap-5 overflow-hidden p-5">
                                <h2 className=" text-center text-4xl font-medium">
                                    {l("onboarding_title_2")}
                                </h2>
                                <p className="text-center text-neutral-500">
                                    {l("onboarding_description_2")}
                                </p>
                                <div className="flex flex-col">
                                    {Array(4)
                                        .fill(null)
                                        .map((_, rowIndex) => (
                                            <div
                                                key={rowIndex}
                                                className="group relative flex gap-3 overflow-hidden p-2"
                                                style={{
                                                    maskImage:
                                                        "linear-gradient(to left, transparent 0%, black 20%, black 80%, transparent 100%)",
                                                }}
                                            >
                                                {Array(5)
                                                    .fill(null)
                                                    .map((index) => (
                                                        <div
                                                            key={index}
                                                            className={cn(
                                                                "flex shrink-0 flex-row justify-around gap-3",
                                                                rowIndex % 2 ===
                                                                    0
                                                                    ? "animate-logo-cloud"
                                                                    : "animate-logo-cloud-reverse",
                                                            )}
                                                        >
                                                            {RUNNING_LINE_COUNTRIES[
                                                                rowIndex
                                                            ].map(
                                                                (
                                                                    c: any,
                                                                    key: number,
                                                                ) => (
                                                                    <ReactCountryFlag
                                                                        countryCode={
                                                                            c
                                                                        }
                                                                        svg
                                                                        className="h-10 w-10 rounded-full object-cover"
                                                                        key={
                                                                            key
                                                                        }
                                                                        style={{
                                                                            fontSize:
                                                                                "36px",
                                                                        }}
                                                                    />
                                                                ),
                                                            )}
                                                        </div>
                                                    ))}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </CarouselItem>
                        <CarouselItem className="flex w-full flex-col items-center">
                            <div className="flex flex-col items-stretch justify-between gap-5 overflow-hidden p-5">
                                <h2 className=" text-center text-4xl font-medium">
                                    <br /> {l("onboarding_title_3")}
                                </h2>
                                <p className="text-center text-neutral-500">
                                    {l("onboarding_description_3")}
                                </p>
                                <div className="flex flex-col items-center justify-center p-5 pt-24">
                                    <TonConnectButton />
                                </div>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>
                <div className="flex flex-row items-center justify-between px-5">
                    <div className="flex flex-row gap-1.5 py-2 text-center text-sm text-muted-foreground">
                        {Array(count)
                            .fill(null)
                            .map((_, index) => (
                                <Dot
                                    key={index}
                                    className={cn(
                                        "size-3 bg-neutral-400 transition-all",
                                        index + 1 == current &&
                                            "w-7 bg-tgaccent",
                                    )}
                                ></Dot>
                            ))}
                    </div>
                    {count !== current ? (
                        <Button
                            onClick={() => {
                                hapticFeedback();
                                api?.scrollNext();
                            }}
                            size={"bean"}
                            variant={"telegram"}
                        >
                            {l("btn_next")}
                        </Button>
                    ) : wallet ? (
                        <Button
                            onClick={() => {
                                hapticFeedback();
                                finishOnboaringForUser.mutate(tgUser);
                                router.push("/esims");
                            }}
                            size={"bean"}
                            variant={"telegram"}
                        >
                            {l("btn_start")}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => {
                                hapticFeedback("warning");
                                showConfirmationToast({
                                    title: "Are you sure?",
                                    description:
                                        "If you connect wallet you can get bonuses for your referrals",
                                    onNo: () => {},
                                    onYes: () => {
                                        finishOnboaringForUser.mutate(tgUser);
                                        router.push("/esims");
                                    },
                                });
                            }}
                            size={"bean"}
                            variant={"unstyled"}
                            className="font-semibold text-neutral-500 underline underline-offset-2"
                        >
                            {l("btn_skip")}
                        </Button>
                    )}
                </div>
            </div>
        </main>
    );
}
