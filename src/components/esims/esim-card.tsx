"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Esim } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import moment from "moment";
import { TbHandClick } from "react-icons/tb";

import { l } from "@/lib/locale";
import {
    cn,
    detectIOSVersion,
    generateEsimActivationLink,
    hapticFeedback,
} from "@/lib/utils";

import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from "../ui/carousel";
import CircleProgressBar from "../ui/circle-progress";
import Collapse from "../ui/collapse";
import Dot from "../ui/dot";
import QrCode from "../ui/qr-code";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import CopyBadge from "./copy-badge";
import { useTelegram } from "@/hooks/use-telegram";

const EsimCard = ({
    package_id,
    iccid,
    coverage,
    image_url,
    state,
    validity,
    data,
    sm_dp,
    confirmation_code,
    type,
    usage,
    expired_at,
    available_topups,

    open_iccid,
}: Esim) => {
    const router = useRouter();

    const [isOpen, setIsOpen] = useState(false);
    const activationLink = useMemo(() => {
        return generateEsimActivationLink(sm_dp, confirmation_code);
    }, [sm_dp, confirmation_code]);

    useEffect(() => {
        if (open_iccid && open_iccid === iccid) {
            setIsOpen(true);

            // const element = document.getElementById(iccid);
            // if (element) {
            //     element.scrollIntoView({ block: "start", behavior: "smooth" });
            // }
        }
    }, [open_iccid]);

    return (
        <div className="relative flex flex-col">
            <div id={iccid} className="absolute -top-10"></div>

            <div
                onClick={() => {
                    hapticFeedback();
                    setIsOpen(!isOpen);
                }}
                className="z-10 flex cursor-pointer flex-row items-center justify-between rounded-3xl bg-white px-5 py-2"
            >
                <div className="flex flex-col font-bold ">
                    <div className="flex items-center gap-0.5">
                        <span className="capitalize">{l("label_status")}:</span>{" "}
                        <StatusText status={state} />
                    </div>
                    {state == "NOT_ACTIVE" && (
                        <h2 className="flex items-center gap-0.5">
                            <span className="first-letter:capitalize">
                                {l("text_click_to_activate")}
                            </span>
                            <TbHandClick className="h-5 w-5" />
                        </h2>
                    )}
                    {expired_at && (
                        <h2>
                            Valid until:{" "}
                            <ValidUntilText expired_at={expired_at} />
                        </h2>
                    )}
                </div>
                <div>
                    <CircleProgressBar
                        size={76}
                        percent={
                            usage?.remaining > 0
                                ? (usage?.remaining / usage?.total) * 100
                                : 0
                        }
                        strokeWidth={9}
                    >
                        <div className="mt-1 flex flex-col text-center leading-4">
                            <span className=" font-bold ">
                                {(usage?.remaining / 1024).toFixed(1)}
                            </span>{" "}
                            <span className=" text-xs font-bold">Gb</span>
                        </div>
                    </CircleProgressBar>
                </div>
            </div>
            <div className="relative -mt-5 overflow-hidden rounded-b-2xl  pt-5">
                <div className="absolute -z-10 -mt-5 h-full w-full  bg-gradient-to-tr from-tgaccent to-sky-400 opacity-75"></div>

                {usage &&
                    state != "EXPIRED" &&
                    (usage.remaining == 0 ||
                        usage.remaining / usage.total < 0.5) && (
                        <TopUpCarousel
                            topUps={available_topups}
                            iccid={iccid}
                            image_url={image_url}
                            coverage={coverage}
                        />
                    )}

                <Collapse className=" px-4  duration-200" isOpen={isOpen}>
                    <div className="w-full py-2 pt-4">
                        <Tabs defaultValue={"auto"}>
                            <TabsList className="w-full">
                                {
                                    <TabsTrigger
                                        onClick={() => {
                                            hapticFeedback();
                                        }}
                                        className="w-full capitalize"
                                        value="auto"
                                    >
                                        {l("nav_activation_auto")}
                                    </TabsTrigger>
                                }
                                <TabsTrigger
                                    onClick={() => {
                                        hapticFeedback();
                                    }}
                                    className="w-full capitalize"
                                    value="manual"
                                >
                                    {l("nav_activation_manual")}
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="auto">
                                <div className="flex items-center justify-center">
                                    <div className="flex flex-col gap-6 px-2 pt-2 text-sm font-bold">
                                        <div className="flex flex-col gap-2">
                                            <div className=" rounded-lg border-2 border-redish bg-white/10 px-2 py-1">
                                                <h2 className="font-semibold text-redish">
                                                    {l("important_note")}
                                                </h2>
                                            </div>
                                            {detectIOSVersion() > 17.5 && (
                                                <h2 className=" text-balance text-center">
                                                    {l("instruction_auto")}
                                                </h2>
                                            )}
                                        </div>
                                        {detectIOSVersion() > 17.5 ? (
                                            <Link
                                                onClick={() => {
                                                    hapticFeedback("success");
                                                }}
                                                href={
                                                    "https://esimsetup.apple.com/esim_qrcode_provisioning?carddata=" +
                                                    activationLink
                                                }
                                                target="_blank"
                                            >
                                                <QrCode url={activationLink} />
                                            </Link>
                                        ) : (
                                            <QrCode url={activationLink} />
                                        )}
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="manual">
                                <div className="flex h-72 flex-col gap-3 px-2 pt-2 text-sm font-bold">
                                    <div className=" rounded-lg border-2 border-redish bg-white/10 px-2 py-1">
                                        <h2 className="font-semibold text-redish text-shadow-sm">
                                            {l("important_note")}
                                        </h2>
                                    </div>
                                    <h2>
                                        1. Open settings -&gt; Cellular -&gt;
                                        Add
                                    </h2>
                                    <h2>
                                        2. Click “Use QR code” -&gt; Add manual
                                    </h2>
                                    <div className="flex flex-col gap-1">
                                        <h2>3. Your SM-DP+ </h2>
                                        <CopyBadge text={sm_dp} />
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h2>4. Your Activation code</h2>
                                        <CopyBadge text={confirmation_code} />
                                    </div>
                                    <h2>5. Turn On Roaming</h2>
                                    <div className="flex items-center justify-between">
                                        <h2>6. Select network</h2>{" "}
                                        <span
                                            onClick={() => {
                                                hapticFeedback();
                                                router.push(
                                                    "/esims/networks/" +
                                                        package_id,
                                                );
                                            }}
                                            className=" text-tgaccent underline underline-offset-2"
                                        >
                                            Check list
                                        </span>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </Collapse>
                <div className=" flex items-center justify-between px-4 py-3 text-sm font-semibold text-white">
                    <div className="flex items-center gap-2">
                        <Image
                            width={28}
                            height={28}
                            src={image_url}
                            alt={coverage}
                            className="esim-mask rounded-sm"
                        />
                        <h3 className="uppercase">{coverage}</h3>
                    </div>
                    <div>
                        <h3 className=" uppercase">
                            {validity} {l("text_days")}
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EsimCard;

const StatusText = ({ status }: { status: string }) => {
    if (status === "ACTIVE")
        return (
            <span className="text-green-500">{l("text_status_active")}</span>
        );
    if (status === "NOT_ACTIVE")
        return (
            <span className="text-yellow-500">
                {l("text_status_not_active")}
            </span>
        );
    if (status === "EXPIRED")
        return <span className="text-red-500">{l("text_status_expired")}</span>;
    if (status === "FINISHED")
        return <span className="text-red-500">OUT OF DATA</span>;
    return <span className="">{status}</span>;
};

const ValidUntilText = ({ expired_at }: { expired_at: string }) => {
    const formatedDate = moment(expired_at).format("D MMMM YYYY");
    const date = new Date(expired_at);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return <span className="text-red-500">{formatedDate}</span>;
    if (days < 7) return <span className="text-red-500">{formatedDate}</span>;
    if (days < 30)
        return <span className="text-yellow-500">{formatedDate}</span>;
    // return <span className="text-green-500">{days} DAYS</span>;
};

const TopUpCarousel = ({
    topUps,
    iccid,
    image_url,
    coverage,
}: {
    topUps: any[];
    iccid: string;
    image_url: string;
    coverage: string;
}) => {
    const { tgUser } = useTelegram();

    const router = useRouter();

    const [selectedPackage, setSelectedPackage] = useState<any>(topUps[0]);

    const { data: rateTonUsd } = useQuery({
        queryKey: ["ratetonusd"],
        queryFn: async () => {
            const { data } = await axios.get(
                "https://tonapi.io/v2/rates?tokens=ton&currencies=usd",
            );
            return data.rates.TON.prices.USD;
        },
        refetchInterval: 1000 * 10, // 10 sec
    });

    const priceInTon = useMemo(() => {
        if (!rateTonUsd) return 999;

        const priceInTon = selectedPackage?.total_price / rateTonUsd;
        return priceInTon.toFixed(3);
    }, [rateTonUsd, selectedPackage]);

    const createEsimOrder = async () => {
        hapticFeedback();
        await axios
            .post("/api/topup/create", {
                iccid: iccid,
                net_price: selectedPackage.net_price,
                original_price: selectedPackage.price,
                total_price: selectedPackage.total_price,
                total_price_eur: selectedPackage.total_price_eur,
                total_price_ton: priceInTon,
                telegram_id: tgUser?.id,
                package_id: selectedPackage.id,
                image_url: image_url,
                coverage: coverage,
                validity: selectedPackage.day,
                data: selectedPackage.data,
            })
            .then((res) => {
                console.log(res);
                if (res?.data?.order_id) {
                    router.push(`/esims/pay/${res.data.order_id}`);
                }
            });
    };

    const [api, setApi] = useState<CarouselApi>();
    useEffect(() => {
        if (!api) {
            return;
        }

        api.on("select", () => {
            console.log("selected", api.selectedScrollSnap());
        });
    }, [api]);

    if (!topUps || topUps.length == 0) return null;

    return (
        <div className={cn("flex flex-col gap-1 pt-2", "-mx-2")}>
            <h2
                className={cn(
                    "pl-2 text-sm font-semibold uppercase text-white",
                    "px-7",
                )}
            >
                {l("title_topup")}
            </h2>
            <Carousel setApi={setApi}>
                <CarouselContent className={cn("ml-1", "mr-4 pl-4")}>
                    {topUps &&
                        topUps.map((plan: any, index: number) => {
                            return (
                                <CarouselItem
                                    key={index}
                                    className="basis-[182px] cursor-pointer pl-1"
                                >
                                    <div
                                        onClick={() => {
                                            hapticFeedback();
                                            setSelectedPackage(plan);
                                            api?.scrollTo(index);
                                        }}
                                        className={cn(
                                            "relative  z-20 flex h-11 w-[172px] flex-row items-center  justify-center gap-2 rounded-xl  bg-white p-2 transition-all active:border-2 active:border-emerald-300 ",
                                            selectedPackage.id == plan.id &&
                                                "border-2 border-emerald-300",
                                        )}
                                    >
                                        <div className="flex flex-col">
                                            <h2 className=" text-sm font-bold leading-4">
                                                {plan.amount / 1024}
                                                <span>GB</span>
                                            </h2>
                                            <p className=" text-xs font-medium leading-3  text-neutral-500">
                                                {plan.day} {l("text_days")}
                                            </p>
                                        </div>
                                        <Dot className="size-1.5" />
                                        <div>
                                            <h2 className=" text-xl font-bold">
                                                ${plan.total_price}
                                            </h2>
                                        </div>
                                    </div>
                                    {selectedPackage.id == plan.id && (
                                        <div
                                            onClick={() => {
                                                hapticFeedback("medium");
                                                createEsimOrder();
                                            }}
                                            className="relative -mt-2 ml-2 mr-4 rounded-b-xl bg-emerald-300 pb-1.5 pt-3 hover:bg-emerald-300 active:scale-95"
                                        >
                                            <h2 className="text-center text-xs font-bold text-white">
                                                {l("btn_pay")}
                                            </h2>
                                        </div>
                                    )}
                                </CarouselItem>
                            );
                        })}
                </CarouselContent>
            </Carousel>
        </div>
    );
};
