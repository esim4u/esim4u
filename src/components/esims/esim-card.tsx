"use client";

import { Esim } from "@/types";
import { useState } from "react";
import Collapse from "../ui/collapse";
import { hapticFeedback } from "@/lib/utils";
import Image from "next/image";
import CircleProgressBar from "../ui/circle-progress";
import moment from "moment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const EsimCard = ({
    iccid,
    coverage,
    image_url,
    status,
    state,
    validity,
    data,
    qrcode_url,
    sm_dp,
    confirmation_code,
    type,
    usage,
    expired_at,
}: Esim) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col">
            <div
                onClick={() => {
                    hapticFeedback();
                    setIsOpen(!isOpen);
                }}
                className="flex flex-row justify-between items-center bg-white z-10 py-2 px-5 rounded-3xl"
            >
                <div className="flex flex-col font-bold ">
                    <h2>
                        Status: <StatusText status={state} />
                    </h2>
                    <h2>
                        Valid until: <ValidUntilText expired_at={expired_at} />
                    </h2>
                </div>
                <div>
                    <CircleProgressBar
                        size={76}
                        percent={
                            usage.remaining > 0
                                ? (usage.remaining / usage.total) * 100
                                : 0
                        }
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
            <Collapse
                className="bg-sky-200/90 px-4 pt-5 -mt-5 duration-200"
                isOpen={isOpen}
            >
                <div className="py-2 w-full">
                    <Tabs defaultValue="account">
                        <TabsList className="w-full">
                            <TabsTrigger className="w-full" value="auto">
                                Auto
                            </TabsTrigger>
                            <TabsTrigger className="w-full" value="qr">
                                QrCode
                            </TabsTrigger>
                            <TabsTrigger className="w-full" value="manual">
                                Manual
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="auto">
                            Auto
                        </TabsContent>
                        <TabsContent value="qr">
                            Qr
                        </TabsContent>
                        <TabsContent value="manual">
                            <div className="flex flex-col">
                                <div className=" border-2 rounded-lg border-redish bg-redish/5 py-1 px-2">
                                    <h2 className="text-redish font-semibold">
                                        IMPORTANT! Do this on Wi-Fi network
                                    </h2>
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </Collapse>
            <div className="bg-sky-200/90 px-4 py-3 rounded-b-2xl text-sm text-sky-700/70 flex items-center justify-between font-semibold">
                <div className="flex gap-2 items-center">
                    <Image
                        width={28}
                        height={28}
                        src={image_url}
                        alt={coverage}
                    />
                    <h3 className="uppercase">{coverage}</h3>
                </div>
                <div>
                    <h3 className="">{validity} DAYS</h3>
                </div>
            </div>
        </div>
    );
};

export default EsimCard;

const StatusText = ({ status }: { status: string }) => {
    if (status === "ACTIVE")
        return <span className="text-green-500">ACTIVE</span>;
    if (status === "NOT_ACTIVE")
        return <span className="text-yellow-500">NOT ACTIVE YET</span>;
    if (status === "EXPIRED")
        return <span className="text-red-500">ESIM EXPIRED</span>;
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
