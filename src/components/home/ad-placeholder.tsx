"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTelegram } from "@/providers/telegram-provider";

import { hapticFeedback } from "@/lib/utils";

type Props = {};

const AdPlaceholder = (props: Props) => {
    const { webApp } = useTelegram();
    const router = useRouter();
    return (
        <div className=" w-full">
            <div className="relative flex flex-col items-center justify-center gap-2 bg-white rounded-3xl h-[180px] w-full">
                {/* <div
                    className={cn(
                        "absolute left-4 top-4 flex  gap-2 uppercase items-center font-medium text-neutral-500"
                    )}
                >
                    <h2>{l("title_achievements")}</h2>{" "}
                </div> */}
                <div className="flex flex-col mt-1 items-center justify-center">
                    {/* <GiAchievement className=" text-neutral-300/75 size-[68px]" /> */}
                    <h2 className="uppercase items-center font-medium text-neutral-500">
                        your ad could be here
                    </h2>
                    <span
                        onClick={() => {
                            hapticFeedback();
                            webApp?.openTelegramLink(
                                "https://t.me/esim4u_support_bot",
                            );
                            webApp?.close();
                        }}
                        className="text-blue-500 underline underline-offset-2 font-medium"
                    >
                        contact us
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AdPlaceholder;
