"use client";

import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { createUser } from "@/services/supabase";
import { useTelegram } from "@/providers/telegram-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn, hapticFeedback } from "@/lib/utils";
import { TonConnectButton } from "@tonconnect/ui-react";
import { RUNNING_LINE_LOGOS } from "@/constants";

export default function OnBoardingPage() {
    const router = useRouter();
    const { user: tgUser, webApp, start_param } = useTelegram();
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
            return await createUser(tgUser, start_param);
        },
        onError: (error) => {},
        onSuccess: (data) => {},
    });

    useEffect(() => {
        if (tgUser && webApp) {
            webApp?.MainButton.hide();
            createAppUser.mutate(tgUser);
        }
    }, [tgUser, webApp]);

    return (
        <main className="overflow-x-hidden h-dvh flex flex-col justify-center">
            <div className="flex flex-col pt-[10dvh] pb-5 gap-5">
                <Carousel setApi={setApi} className="w-full">
                    <CarouselContent className="">
                        <CarouselItem className="w-full flex flex-col items-center">
                            <div className="flex flex-col gap-5 p-5">
                                <h2 className=" text-4xl font-medium text-center">
                                    Revolutionary <br /> Telegram mini App
                                </h2>
                                <p className="text-center text-neutral-500">
                                    Buy eSIM with crypto or card using your
                                    lovely messenger wherever you go
                                </p>
                                <div className="flex flex-col gap-2">
                                    <div className="grid grid-cols-4 grid-rows-2 gap-2 max-h-48">
                                        <div className="relative flex justify-center items-end rounded-3xl overflow-hidden	">
                                            <Image
                                                width={736}
                                                height={736}
                                                className=" w-full h-full object-cover"
                                                src={
                                                    "https://s3-alpha-sig.figma.com/img/abb6/4c50/484ea1a86032000ebc0f04992146841e?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SsilR0Wxd4bD7m6oRVsaQ0HhKVKQonuAYjLtyPLobUqkUd54TogYcRdes-hOQSnpx4iaHaIV-R9rO9ddrqKWG9zbDEAeVg0lxJDU7EhLy5glixQMV0bOLFMqJmNHscTw4Z4wRKyJdnvTcWVcUYP2qSEJokwPJXOpDOrS4CxTGztxpPWdJyolv3FdtuZkselsHy8vzrPRjZ-Wt2p736RnSRBEBE9DnuxTJAfxJkH8GksIptJrLE2wFlfso2texfxhCfR5QP8Ske0q6dn5BxMeC63BrFtG5J8yGIwUFsrdYz-kX8sE54-jdeLDDo6KW9lyAAvTm0vu4mjLLYhw-~wCUw__"
                                                }
                                                alt="news"
                                            />
                                            <div className="absolute h-1/2 w-full bg-gradient-to-t from-black/50">
                                                {" "}
                                            </div>

                                            <span className="absolute font-medium text-[10px] text-white pb-2 uppercase">
                                                UAE
                                            </span>
                                        </div>
                                        <div className="relative  flex justify-center items-end rounded-3xl overflow-hidden ">
                                            <Image
                                                width={736}
                                                height={736}
                                                className=" w-full h-full object-cover"
                                                src={
                                                    "https://s3-alpha-sig.figma.com/img/1f76/2cb7/266a5e95b2e9d2372e782311a9268523?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=DuWF2Kqkd1ZjaluInK7sDZgthaiE2rmlTe5OpAdClPpri2RXdAqr6N8YO75q4cje-qvevpSOO0eMDu8xrPtTMErltcYF4htW~U-gQkolraAcfrrqspI49PciBNP-UYR0Hc2yl4BdVShYR3c1bZ5ksQRupWx-yRlt7XUdPcY26dqxfyMuOWoIIkLid5UcvzhhZLv0E0YimSKfCa0EttB5n7PSTXFSAdYsAX2b0xMNXdGxfnj~rKz2XLOHchj41hIwHto-AOZAaxhwww1EM8o0wgqqI-VjwoyS-g1CTj2Pn32rqGwWwfH-lZ3hyl4H4ewwG~XEKiBSE4dWEuw7FFLrGQ__"
                                                }
                                                alt="news"
                                            />
                                            <div className="absolute h-1/2 w-full bg-gradient-to-t from-black/50">
                                                {" "}
                                            </div>

                                            <span className="absolute font-medium text-[10px] text-white pb-2 uppercase">
                                                SWITZERLAND
                                            </span>
                                        </div>
                                        <div className="relative col-span-2 row-span-2 flex justify-center items-end rounded-3xl overflow-hidden 	">
                                            <Image
                                                width={736}
                                                height={736}
                                                className=" w-full h-full object-cover"
                                                src={
                                                    "https://s3-alpha-sig.figma.com/img/cf58/2b23/9ce597079a38aa3d3189fcc059121645?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oia9LMj5WF~PoBNuLd2I~pTH1EG~CrkqdR8KKboXHsP6ekg3Kqw7JQeKBKAUiHtQqsOWTvR0VOm12m0X3ZHWyRgj7M~eNUK2vWEwd5e~~mufaUmMJ1164WEVxzQnDxuM0XDAWw-690ZTqkn9txXMQlVCRCdkJFsrcSkNqgu3pUiTiJUa3sPa7QoYI2wz04o5wkilvkaz3ma7y35~gXdnHJt9xDImTHty1sb0OSCgYyPiXN81ZQrThwbxnaIwGsKNwSkhB6gTP8mDHLmT42XcAzmsGksDhwAZwxICsZq0v2yAz~AseDklX10YyJjzGXvdm9GlAGz8LjuTqGMv46fKVQ__"
                                                }
                                                alt="news"
                                            />
                                            <div className="absolute h-1/2 w-full bg-gradient-to-t from-black/50">
                                                {" "}
                                            </div>

                                            <span className="absolute font-medium text-lg text-white pb-3 uppercase">
                                                SPAIN
                                            </span>
                                        </div>
                                        <div className="relative col-span-2 row-span-1  flex justify-center items-end rounded-3xl overflow-hidden 	">
                                            <Image
                                                width={736}
                                                height={736}
                                                className=" w-full h-full object-cover"
                                                src={
                                                    "https://s3-alpha-sig.figma.com/img/fe16/ee05/4fdb12ce221feda8da1d52059f7655ed?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=gPhhjk383HJjBGV~hof2e426amq9XT2fIBTdUfs8xdCuftWcmwiqPKHQxdGOB7S~KSIg1IzOvr8yF8a1gkiKk9xlN88A4w1Oi8wQATUymhxWVfNnDozdPor826~jbbIOlDncwwFc~HOk7mHERWLirLAzJQ9dVfNvWDAyjVgqwHZNkMKo18T~pw300pvpK8uzsbEECt~sn8mpKmSIjeQaH5cLre2WyiV2HM~2WTZC0bKorlvrJtCH1yAwc2SMC2Aef7FvdfhYB~9R-S268foGj2uEH89I3fOc7jqjlqhtA8-ydFepDuqIIk2-R7y9APIsf2okZ20~7376wdj~eC2zvQ__"
                                                }
                                                alt="news"
                                            />
                                            <div className="absolute h-1/2 w-full bg-gradient-to-t from-black/50">
                                                {" "}
                                            </div>

                                            <span className="absolute font-medium text-xs text-white pb-2 uppercase">
                                                ITALY
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                        <CarouselItem className="w-full  flex flex-col  items-center overflow-hidden">
                            <div className="flex flex-col gap-5 p-5 overflow-hidden">
                                <h2 className=" text-4xl font-medium text-center">
                                    Dozens <br />
                                    of countries
                                </h2>
                                <p className="text-center text-neutral-500">
                                    The first place in Telegram that allows you
                                    to get eSIM in more than 160 countries
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
                                                // style={{
                                                //     maskImage:
                                                //         "linear-gradient(to left, transparent 0%, black 20%, black 80%, transparent 95%)",
                                                // }}
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
                                                                    : "animate-logo-cloud-reverse"
                                                            )}
                                                        >
                                                            {RUNNING_LINE_LOGOS.map(
                                                                (
                                                                    logo: any,
                                                                    key: number
                                                                ) => (
                                                                    <img
                                                                        key={
                                                                            key
                                                                        }
                                                                        src={
                                                                            logo.url
                                                                        }
                                                                        className="h-10 w-10"
                                                                        alt={`${logo.name}`}
                                                                    />
                                                                )
                                                            )}
                                                        </div>
                                                    ))}
                                            </div>
                                        ))}
                                </div>
                            </div>
                        </CarouselItem>
                        <CarouselItem className="w-full flex flex-col items-center">
                            <div className="flex justify-between items-stretch flex-col gap-5 p-5 overflow-hidden">
                                <h2 className=" text-4xl font-medium text-center">
                                    <br /> Pay and Earn
                                </h2>
                                <p className="text-center text-neutral-500">
                                    Pay with TON easily and quickly here! Enjoy
                                    secure, hassle-free transactions.
                                </p>
                                <div className="p-5 pt-24 flex flex-col justify-center items-center">
                                    <TonConnectButton />
                                </div>
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                </Carousel>
                <div className="pb-5 px-5 flex flex-row justify-between items-center">
                    <div className="py-2 text-center text-sm text-muted-foreground">
                        Slide {current} of {count}
                    </div>
                    <Button
                        onClick={() => {
                            api?.scrollNext();
                        }}
                        size={"bean"}
                        variant={"light"}
                    >
                        NEXT
                    </Button>
                </div>
            </div>
        </main>
    );
}
