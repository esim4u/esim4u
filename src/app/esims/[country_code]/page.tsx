"use client";

import { COUNTRIES } from "@/app/constants";
import { Badge } from "@/components/ui/badge";
import BounceLoader from "@/components/ui/bounce-loader";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import Collapse from "@/components/ui/collapse";
import Dot from "@/components/ui/dot";
import { cn, hapticFeedback } from "@/lib/utils";
import { useTelegram } from "@/providers/telegram-provider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { use, useEffect, useMemo } from "react";
import { MdArrowForwardIos } from "react-icons/md";

const EsimPackagePage = ({ params }: { params: { country_code: string } }) => {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();
    const [selectedPackage, setSelectedPackage] = React.useState<any>(null);
    const [isOpen, setIsOpen] = React.useState(false);

    const {
        data: packageData,
        isLoading,
        isFetched,
    } = useQuery({
        queryKey: ["esim-packages", params.country_code],
        queryFn: async () => {
            const { data } = await axios.get(
                "/api/esims/packages/" + params.country_code
            );
            return data[0];
        },
    });

    const { data: rateTonEuro } = useQuery({
        queryKey: ["ratetoneuro"],
        queryFn: async () => {
            const { data } = await axios.get(
                "https://tonapi.io/v2/rates?tokens=ton&currencies=eur"
            );
            return data.rates.TON.prices.EUR;
        },
        refetchInterval: 1000 * 60, // 1 minute
    });

    useEffect(() => {
        if (webApp) {
            webApp?.BackButton.show();
            webApp?.BackButton.onClick(() => {
                webApp?.BackButton.hide();
                router.push("/esims");
            });
        }
    }, [webApp]);

    useEffect(() => {
        if (isFetched && packageData) {
            setSelectedPackage(packagePlans[0]);
        }
    }, [isFetched, packageData]);

    const packagePlans = useMemo(() => {
        if (!packageData || !packageData.operators) return [];

        //TODO: show operator with most amount of packages
        return packageData.operators[0].packages;
    }, [packageData]);

    const priceInTon = useMemo(() => {
        if (!rateTonEuro) return 999;

        const priceInTon = selectedPackage?.total_price_eur / rateTonEuro;
        return priceInTon.toFixed(2);
    }, [rateTonEuro, selectedPackage]);

    if (isLoading) {
        return (
            <main className="overflow-x-hidden h-dvh flex flex-col justify-center items-center ">
                <BounceLoader />
            </main>
        );
    }

    return (
        <section className="flex flex-col">
            <div className="relative flex flex-col items-center justify-center -mb-6">
                <Image
                    width={200}
                    height={100}
                    className="w-full h-48 object-cover"
                    src={
                        "https://s3-alpha-sig.figma.com/img/fe16/ee05/4fdb12ce221feda8da1d52059f7655ed?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=gPhhjk383HJjBGV~hof2e426amq9XT2fIBTdUfs8xdCuftWcmwiqPKHQxdGOB7S~KSIg1IzOvr8yF8a1gkiKk9xlN88A4w1Oi8wQATUymhxWVfNnDozdPor826~jbbIOlDncwwFc~HOk7mHERWLirLAzJQ9dVfNvWDAyjVgqwHZNkMKo18T~pw300pvpK8uzsbEECt~sn8mpKmSIjeQaH5cLre2WyiV2HM~2WTZC0bKorlvrJtCH1yAwc2SMC2Aef7FvdfhYB~9R-S268foGj2uEH89I3fOc7jqjlqhtA8-ydFepDuqIIk2-R7y9APIsf2okZ20~7376wdj~eC2zvQ__"
                    }
                    alt={packageData.slug}
                />
                <div className="absolute h-full bg-gradient-to-t bottom-0 w-full backdrop-blur-lg blur-lg linear-mask"></div>

                <h1 className="absolute bottom-4 text-white text-center text-2xl pb-6 uppercase  text-shadow-sm shadow-black/50 ">
                    {packageData.slug}
                </h1>
            </div>
            <div className="bg-[#EFEFF3] rounded-t-3xl z-10 p-5 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <h2 className="font-bold text-3xl">
                            {selectedPackage?.total_price_eur}
                            <span className="text-2xl">€</span>
                        </h2>
                        <Dot />
                        <h2 className="flex items-center font-bold text-3xl">
                            {priceInTon}
                            <svg
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g clip-path="url(#clip0_2028_1457)">
                                    <path
                                        d="M20.1036 -0.000366211H3.89546C0.91535 -0.000366211 -0.973515 3.21428 0.525777 5.81304L10.5289 23.1512C11.1816 24.2833 12.8175 24.2833 13.4702 23.1512L23.4753 5.81304C24.9726 3.21843 23.0837 -0.000366211 20.1057 -0.000366211H20.1036ZM10.5207 17.9517L8.34222 13.7355L3.08571 4.33417C2.73894 3.73244 3.16725 2.96135 3.89342 2.96135H10.5187V17.9538L10.5207 17.9517ZM20.9093 4.33214L15.6548 13.7376L13.4763 17.9517V2.95931H20.1016C20.8278 2.95931 21.2561 3.7304 20.9093 4.33214Z"
                                        fill="#1B1C1F"
                                    />
                                </g>
                                <defs>
                                    <clipPath id="clip0_2028_1457">
                                        <rect
                                            width="24"
                                            height="24"
                                            fill="white"
                                        />
                                    </clipPath>
                                </defs>
                            </svg>
                        </h2>
                    </div>
                    <div className="flex flex-col gap-1">
                        <h2 className="pl-2 text-sm uppercase font-medium text-neutral-500">
                            Packages
                        </h2>
                        <Carousel>
                            <CarouselContent className="gap-2">
                                {packageData &&
                                    packagePlans.map(
                                        (plan: any, index: number) => {
                                            return (
                                                <CarouselItem
                                                    key={index}
                                                    className="basis-28"
                                                >
                                                    <div
                                                        onClick={() =>
                                                            setSelectedPackage(
                                                                plan
                                                            )
                                                        }
                                                        className={cn(
                                                            "p-5 border-[2px]  h-16 w-28 border-neutral-400 active:border-4 active:border-blue-500  flex flex-col items-center justify-center rounded-3xl transition-all ",
                                                            selectedPackage ===
                                                                plan &&
                                                                "border-4 border-blue-500"
                                                        )}
                                                    >
                                                        <h2 className="font-bold text-2xl">
                                                            {plan.amount / 1024}
                                                            <span className="text-xl">
                                                                GB
                                                            </span>
                                                        </h2>
                                                        {/* <h2 className="text-center font-bold">
                                                    {plan.data}
                                                </h2> */}
                                                        <p className=" text-xs text-neutral-500 font-medium">
                                                            {plan.day} days{" "}
                                                        </p>
                                                    </div>
                                                </CarouselItem>
                                            );
                                        }
                                    )}
                            </CarouselContent>
                        </Carousel>
                    </div>
                </div>

                <div className=" bg-white p-5 flex flex-col gap-2  rounded-2xl shadow-md">
                    <h2 className="pl-1 text-xs uppercase font-medium text-neutral-500">
                        Information
                    </h2>

                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row items-center justify-between">
                            <h3 className="text-sm font-bold">Coverage</h3>
                            <h3 className="text-sm font-bold">
                                {COUNTRIES[
                                    packageData.operators[0].coverages[0].name.toLowerCase()
                                ] || packageData.operators[0].coverages[0].name}
                            </h3>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                            <h3 className="text-sm font-bold">Plan types</h3>
                            <h3 className="text-sm font-bold capitalize">
                                {packageData.operators[0].plan_type}
                            </h3>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                            <h3 className="text-sm font-bold">Top-up</h3>
                            <h3 className="text-sm font-bold capitalize">
                                {packageData.operators[0].rechargeability
                                    ? "Available"
                                    : "Not available"}
                            </h3>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                            <h3 className="text-sm font-bold">
                                Compatible devices
                            </h3>
                            <button className="text-sm text-blue-500 font-medium underline underline-offset-2 capitalize">
                                Check
                            </button>
                        </div>
                    </div>
                </div>

                <div className=" bg-white p-5 flex flex-col rounded-2xl shadow-md">
                    <div
                        className="cursor-pointer flex items-center justify-between"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <h2 className="cursor-pointer flex items-center gap-1 text-xs uppercase font-medium text-neutral-500">
                            How to install and activate
                            <Badge className="normal-case">Guide</Badge>
                        </h2>
                        <MdArrowForwardIos
                            className={cn(
                                "text-neutral-500 transition-transform",
                                isOpen && " rotate-90"
                            )}
                        />
                    </div>

                    <Collapse isOpen={isOpen}>
                        <div className="pt-2 flex flex-col gap-2 text-sm font-bold">
                            <div className="flex flex-row gap-2">
                                <h3 className="w-4">1.</h3>
                                <h3 className="">Select purchased eSIM</h3>
                            </div>
                            <div className="flex flex-row gap-2">
                                <h3 className="w-4">2.</h3>
                                <h3 className="text-sm">
                                    Check that you connected on WI-FI network
                                </h3>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-row gap-2">
                                    <h3 className="w-4">3.</h3>
                                    <h3 className="text-sm">
                                        Select installation method (Auto, QR
                                        code or Manual)
                                    </h3>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <div className="pl-4 py-2">
                                        <Dot className="size-1.5" />
                                    </div>
                                    <h3 className="text-sm">
                                        Auto - if you have iPhone with iOS 17.4+
                                        you need just click to button “ACTIVATE
                                        eSIM”
                                    </h3>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <div className="pl-4 py-2">
                                        <Dot className="size-1.5" />
                                    </div>
                                    <h3 className="text-sm">
                                        QR code - share to another device and
                                        after that scan with your phone
                                    </h3>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <div className="pl-4 py-2">
                                        <Dot className="size-1.5" />
                                    </div>
                                    <h3 className="text-sm">
                                        Manual - open iPhone settings - Cellular
                                        - Add eSIM. After that, copy “SM-DP+”
                                        address and “code”. Past in settings.
                                    </h3>
                                </div>
                            </div>
                            <div className="flex flex-row gap-2">
                                <h3 className="w-4">4.</h3>
                                <h3 className="text-sm">
                                    Open iPhone settings - Cellular. Select your
                                    Travel eSIM and turn ON Roaming toggle
                                </h3>
                            </div>
                            <div className="flex flex-row gap-2">
                                <h3 className="w-4"> 5. </h3>
                                <h3 className="text-sm">
                                    If connection not established automatically
                                    - select Operator manualy
                                </h3>
                            </div>
                        </div>
                    </Collapse>
                </div>

                <div className="flex flex-col gap-2 p-5 border-2 border-redish rounded-3xl">
                    <div
                        onClick={() => {
                            hapticFeedback(webApp);
                        }}
                        className="flex items-center space-x-2"
                    >
                        <Checkbox id="terms1" />
                        <label
                            htmlFor="terms1"
                            className="cursor-pointer text-sm font-medium "
                        >
                            I agree with the{" "}
                            <b className="underline">terms and conditions</b>{" "}
                            and the <b className="underline">privacy policy</b>
                        </label>
                    </div>
                    <div
                        onClick={() => {
                            hapticFeedback(webApp);
                        }}
                        className=" flex items-center space-x-2"
                    >
                        <Checkbox id="terms2" />
                        <label
                            htmlFor="terms2"
                            className="cursor-pointer text-sm font-medium "
                        >
                            I confirm thрat my{" "}
                            <b className="underline">
                                device is eSIM compatible
                            </b>{" "}
                            and <b>network-unlocked</b>
                        </label>
                    </div>
                </div>
                {/* 
                <pre className="text-balance">
                    {JSON.stringify(packageData, null, 2)}
                </pre> */}
            </div>
        </section>
    );
};

export default EsimPackagePage;
