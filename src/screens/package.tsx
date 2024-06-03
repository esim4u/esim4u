"use client";

import { COUNTRIES } from "@/constants";
import { Badge } from "@/components/ui/badge";
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Checkbox } from "@/components/ui/checkbox";
import Collapse from "@/components/ui/collapse";
import Dot from "@/components/ui/dot";
import { cn, hapticFeedback } from "@/lib/utils";
import { useTelegram } from "@/providers/telegram-provider";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { MdArrowForwardIos } from "react-icons/md";
import { l } from "@/lib/locale";
import { convertUsdToPreferredCurrency } from "@/lib/currency";
import Loader from "@/components/ui/loader";

const Package = ({ params }: { params: { country_code: string } }) => {
    const router = useRouter();
    const path = usePathname();

    const { user: tgUser, webApp } = useTelegram();
    const [selectedPackage, setSelectedPackage] = useState<any>(null);
    const [isOpen, setIsOpen] = useState(false);
    const [api, setApi] = useState<CarouselApi>();
    const [terms, setTerms] = useState({
        terms1: false,
        terms2: false,
    });

    useEffect(() => {
        if (!api) {
            return;
        }

        api.on("select", () => {
            console.log("selected", api.selectedScrollSnap());
        });
    }, [api]);

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
        placeholderData: keepPreviousData,
    });

    const { data: rateTonUsd } = useQuery({
        queryKey: ["ratetonusd"],
        queryFn: async () => {
            const { data } = await axios.get(
                "https://tonapi.io/v2/rates?tokens=ton&currencies=usd"
            );
            return data.rates.TON.prices.USD;
        },
        refetchInterval: 1000 * 10, // 10 sec
    });

    const { data: preferredCurrencyPrice } = useQuery({
        queryKey: ["preferredCurrencyPrice", selectedPackage?.total_price],
        queryFn: async () => {
            return await convertUsdToPreferredCurrency(
                selectedPackage?.total_price
            );
        },
        enabled: !!selectedPackage?.total_price,
        placeholderData: keepPreviousData,
    });

    useEffect(() => {
        if (webApp) {
            webApp?.MainButton.show();

            webApp?.BackButton.show();
        }
    }, [webApp]);

    useEffect(() => {
        if (terms.terms1 && terms.terms2) {
            webApp?.MainButton.setParams({
                text: l("btn_pay"),
                color: "#3b82f6",
                is_active: true,
                is_visible: true,
            });
        } else {
            webApp?.MainButton.setParams({
                text: l("btn_pay"),
                color: "#444444",
                is_active: false,
                is_visible: true,
            });
        }
    }, [terms]);

    useEffect(() => {
        if (isFetched && packageData) {
            setSelectedPackage(packagePlans[0]);
        }
    }, [isFetched, packageData]);

    const createEsimOrder = useCallback(async () => {
        hapticFeedback();
        await axios
            .post("/api/esims/create", {
                net_price: selectedPackage.net_price,
                original_price: selectedPackage.price,
                total_price: selectedPackage.total_price,
                total_price_eur: selectedPackage.total_price_eur,
                total_price_ton: priceInTon,
                telegram_id: tgUser?.id,
                package_id: selectedPackage.id,
                coverage: packageData.title,
                image_url: packageData.image.url,
                validity: selectedPackage.day,
                data: selectedPackage.data,
            })
            .then((res) => {
                console.log(res);
                if (res?.data?.order_id) {
                    router.push(`/esims/pay/${res.data.order_id}`);
                }
            });
    }, [selectedPackage, rateTonUsd]);

    useEffect(() => {
        webApp?.offEvent("mainButtonClicked");

        webApp?.onEvent("mainButtonClicked", createEsimOrder);
        return () => {
            webApp?.offEvent("mainButtonClicked", createEsimOrder);
        };
    }, [selectedPackage, rateTonUsd]);

    const packagePlans = useMemo(() => {
        if (!packageData || !packageData.operators) return [];

        //TODO: show operator with most amount of packages
        return packageData.operators[0].packages;
    }, [packageData]);

    const priceInTon = useMemo(() => {
        if (!rateTonUsd) return 999;

        const priceInTon = selectedPackage?.total_price / rateTonUsd;
        return priceInTon.toFixed(3);
    }, [rateTonUsd, selectedPackage]);

    if (isLoading) {
        return (
            <main className="overflow-x-hidden h-dvh flex flex-col justify-center items-center ">
                <Loader />
            </main>
        );
    }

    return (
        <section className="flex flex-col">
            <div className="relative flex flex-col items-center justify-center -mb-6">
                <Image
                    width={200}
                    height={100}
                    className="w-full h-48 object-cover rounded-lg overflow-hidden"
                    src={"/img/countries/global.png"}
                    alt={packageData.slug}
                />
                {/* <div className="absolute h-2/3 bg-gradient-to-t bottom-0 w-full backdrop-blur-lg blur-lg linear-mask"></div> */}
                <div className="absolute h-2/3 bg-gradient-to-t from-black/75 bottom-0 w-full "></div>

                <h1 className="absolute bottom-4 text-white text-center text-2xl pb-6 uppercase  text-shadow-sm shadow-black/50 ">
                    {packageData.slug}
                </h1>
            </div>
            <div className="bg-[#EFEFF3] rounded-t-3xl z-10 p-5 flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <h2 className="font-bold text-3xl">
                            {preferredCurrencyPrice?.amount}
                            <span className="text-2xl">
                                {preferredCurrencyPrice?.symbol}
                            </span>
                        </h2>
                        {/* <Dot />
                        <h2 className="font-bold text-3xl">
                            {selectedPackage?.total_price}
                            <span className="text-2xl">$</span>
                        </h2> */}
                        <Dot />
                        <h2 className="flex items-center font-bold text-3xl">
                            {priceInTon}
                            <svg
                                className="mt-1"
                                width="18"
                                height="18"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <g clipPath="url(#clip0_2028_1457)">
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
                    {
                        //TODO: move prices to separate component
                    }
                    <div className={cn("flex flex-col gap-1", "-mx-5")}>
                        <h2
                            className={cn(
                                "pl-2 text-sm uppercase font-medium text-neutral-500",
                                "px-7"
                            )}
                        >
                            {l("title_packages")}
                        </h2>
                        <Carousel setApi={setApi}>
                            <CarouselContent
                                className={cn("ml-1", "pl-4 mr-4")}
                            >
                                {packageData &&
                                    packagePlans.map(
                                        (plan: any, index: number) => {
                                            return (
                                                <CarouselItem
                                                    key={index}
                                                    className="cursor-pointer basis-[122px] pl-1"
                                                >
                                                    <div
                                                        onClick={() => {
                                                            hapticFeedback();
                                                            setSelectedPackage(
                                                                plan
                                                            );
                                                            api?.scrollTo(
                                                                index
                                                            );
                                                        }}
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
                                                            {plan.day}{" "}
                                                            {l("text_days")}
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
                        {l("title_information")}
                    </h2>

                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row items-center justify-between">
                            <h3 className="text-sm capitalize font-bold">
                                {l("label_coverage")}
                            </h3>
                            {packageData.operators[0].coverages.length > 1 ? (
                                <button
                                    onClick={() => {
                                        hapticFeedback();
                                        router.push(`${path}/coverage`);
                                    }}
                                    className="text-sm text-blue-500 font-medium underline underline-offset-2 capitalize"
                                >
                                    {packageData.operators[0].coverages.length}{" "}
                                    {l("text_countries")}
                                </button>
                            ) : (
                                <h3 className="text-sm font-bold">
                                    {COUNTRIES[
                                        packageData.operators[0].coverages[0].name.toLowerCase()
                                    ] ||
                                        packageData.operators[0].coverages[0]
                                            .name}
                                </h3>
                            )}
                        </div>
                        <div className="flex flex-row items-center justify-between">
                            <h3 className="text-sm font-bold capitalize">
                                {l("label_plan")}
                            </h3>
                            <h3 className="text-sm font-bold capitalize">
                                {packageData.operators[0].plan_type &&
                                    l("text_plan")}
                            </h3>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                            <h3 className="text-sm font-bold capitalize">
                                {l("label_top_up")}
                            </h3>
                            <h3 className="text-sm font-bold capitalize">
                                {packageData.operators[0].rechargeability
                                    ? l("text_top_up")
                                    : "Not available"}
                            </h3>
                        </div>
                        <div className="flex flex-row items-center justify-between">
                            <h3 className="text-sm font-bold capitalize">
                                {l("label_compatible_devices")}
                            </h3>
                            <button
                                onClick={() => {
                                    hapticFeedback();
                                    router.push(`/esims/compatible-devices`);
                                }}
                                className="text-sm text-blue-500 font-medium underline underline-offset-2 capitalize"
                            >
                                {l("text_compatible_devices")}
                            </button>
                        </div>
                    </div>
                </div>

                <div className=" bg-white p-5 flex flex-col rounded-2xl shadow-md">
                    <div
                        className="cursor-pointer flex items-center justify-between"
                        onClick={() => {
                            hapticFeedback();
                            setIsOpen(!isOpen);
                        }}
                    >
                        <h2 className="cursor-pointer flex items-center gap-1 text-xs uppercase font-medium text-neutral-500">
                            {l("title_guide")}
                            <Badge className="capitalize ">
                                {l("badge_guide")}
                            </Badge>
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
                                <h3 className="">{l("instruction_1")}</h3>
                            </div>
                            <div className="flex flex-row gap-2">
                                <h3 className="w-4">2.</h3>
                                <h3 className="text-sm">
                                    {l("instruction_2")}
                                </h3>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-row gap-2">
                                    <h3 className="w-4">3.</h3>
                                    <h3 className="text-sm">
                                        {l("instruction_3")}
                                    </h3>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <div className="pl-4 py-2">
                                        <Dot className="size-1.5" />
                                    </div>
                                    <h3 className="text-sm">
                                        {l("instruction_3_auto")}
                                    </h3>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <div className="pl-4 py-2">
                                        <Dot className="size-1.5" />
                                    </div>
                                    <h3 className="text-sm">
                                        {l("instruction_3_qr")}
                                    </h3>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <div className="pl-4 py-2">
                                        <Dot className="size-1.5" />
                                    </div>
                                    <h3 className="text-sm">
                                        {l("instruction_3_manual")}
                                    </h3>
                                </div>
                            </div>
                            <div className="flex flex-row gap-2">
                                <h3 className="w-4">4.</h3>
                                <h3 className="text-sm">
                                    {l("instruction_4")}
                                </h3>
                            </div>
                            <div className="flex flex-row gap-2">
                                <h3 className="w-4"> 5. </h3>
                                <h3 className="text-sm">
                                    {l("instruction_5")}
                                </h3>
                            </div>
                        </div>
                    </Collapse>
                </div>

                <div className="flex flex-col gap-2 p-5 border-2 border-redish rounded-3xl">
                    <div
                        onClick={() => {
                            hapticFeedback();
                        }}
                        className="flex items-center space-x-2"
                    >
                        <Checkbox
                            onCheckedChange={(checked: boolean) => {
                                setTerms({
                                    ...terms,
                                    terms1: checked,
                                });
                            }}
                            checked={terms.terms1}
                            id="terms1"
                        />
                        <label
                            htmlFor="terms1"
                            className="cursor-pointer text-sm font-medium "
                        >
                            {l("text_terms_conditions")}
                        </label>
                    </div>
                    <div
                        onClick={() => {
                            hapticFeedback();
                        }}
                        className=" flex items-center space-x-2"
                    >
                        <Checkbox
                            onCheckedChange={(checked: boolean) => {
                                setTerms({
                                    ...terms,
                                    terms2: checked,
                                });
                            }}
                            checked={terms.terms2}
                            id="terms2"
                        />
                        <label
                            htmlFor="terms2"
                            className="cursor-pointer text-sm font-medium "
                        >
                            {l("text_device_compatible")}
                        </label>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Package;
