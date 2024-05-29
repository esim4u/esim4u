"use client";

import { Esim } from "@/types";
import { useEffect, useMemo, useState } from "react";
import Collapse from "../ui/collapse";
import {
    detectIOSVersion,
    generateEsimActivationLink,
    hapticFeedback,
} from "@/lib/utils";
import Image from "next/image";
import CircleProgressBar from "../ui/circle-progress";
import moment from "moment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import QrCode from "../ui/qr-code";
import CopyBadge from "./copy-badge";
import Link from "next/link";
import { Button } from "../ui/button";
import { TbHandClick } from "react-icons/tb";
import { l } from "@/lib/locale";

const EsimCard = ({
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
}: Esim) => {
    const [isOpen, setIsOpen] = useState(false);
    const activationLink = useMemo(() => {
        return generateEsimActivationLink(sm_dp, confirmation_code);
    }, [sm_dp, confirmation_code]);

    return (
        <div className="flex flex-col">
            <div
                onClick={() => {
                    hapticFeedback();
                    setIsOpen(!isOpen);
                }}
                className="cursor-pointer flex flex-row justify-between items-center bg-white z-10 py-2 px-5 rounded-3xl"
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
                            <TbHandClick className="w-5 h-5" />
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
                            usage.remaining > 0
                                ? (usage.remaining / usage.total) * 100
                                : 0
                        }
                        strokeWidth={9}
                    >
                        <div className="flex flex-col leading-4 text-center mt-1">
                            <span className=" font-bold ">
                                {(usage.remaining / 1024).toFixed(1)}
                            </span>{" "}
                            <span className=" font-bold text-xs">Gb</span>
                        </div>
                    </CircleProgressBar>
                </div>
            </div>
            <div className="bg-gradient-to-tr from-blue-500/75 to-sky-400/50  rounded-b-2xl pt-5  -mt-5">
                <Collapse
                    className=" px-4  duration-200"
                    isOpen={isOpen}
                >
                    <div className="py-2 pt-4 w-full">
                        <Tabs
                            defaultValue={
                                detectIOSVersion() > 17.5 ? "auto" : "qr"
                            }
                        >
                            <TabsList className="w-full">
                                {detectIOSVersion() > 17.5 && (
                                    <TabsTrigger
                                        className="w-full capitalize"
                                        value="auto"
                                    >
                                        {l("nav_activation_auto")}
                                    </TabsTrigger>
                                )}
                                <TabsTrigger
                                    className="w-full capitalize"
                                    value="qr"
                                >
                                    {l("nav_activation_qr")}
                                </TabsTrigger>
                                <TabsTrigger
                                    className="w-full capitalize"
                                    value="manual"
                                >
                                    {l("nav_activation_manual")}
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="auto">
                                <div className="h-72 flex items-center justify-center">
                                    <div className="flex flex-col gap-6 pt-2 px-2 text-sm font-bold">
                                        <div className="flex flex-col gap-2">
                                            <div className=" border-2 rounded-lg border-redish bg-white/10 py-1 px-2">
                                                <h2 className="text-redish font-semibold">
                                                    {l("important_note")}
                                                </h2>
                                            </div>
                                            <h2 className=" text-center text-balance">
                                                {l("instruction_auto")}
                                            </h2>
                                        </div>
                                        <Button
                                            className="rounded-full h-14 text-base w-full"
                                            asChild
                                        >
                                            <Link
                                                href={
                                                    "https://esimsetup.apple.com/esim_qrcode_provisioning?carddata=" +
                                                    activationLink
                                                }
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
                                                {l("btn_activete_esim")}
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </TabsContent>
                            <TabsContent value="qr">
                                <div className="flex items-center justify-center h-72 pt-2">
                                    <QrCode url={activationLink} />
                                </div>
                            </TabsContent>
                            <TabsContent value="manual">
                                <div className="h-72 flex flex-col gap-3 pt-2 px-2 text-sm font-bold">
                                    <div className=" border-2 rounded-lg border-redish bg-white/10 py-1 px-2">
                                        <h2 className="text-redish text-shadow-sm font-semibold">
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
                                        <h2>6. Select needed network</h2>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </Collapse>
                <div className=" px-4 py-3 text-sm text-white flex items-center justify-between font-semibold">
                    <div className="flex gap-2 items-center">
                        <Image
                            width={28}
                            height={28}
                            src={image_url}
                            alt={coverage}
                            className="rounded-sm"
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
