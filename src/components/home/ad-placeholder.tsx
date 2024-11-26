"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { hapticFeedback } from "@/lib/utils";

type Props = {};

const AdPlaceholder = (props: Props) => {
    return (
        <div className=" w-full">
            <div className="relative flex h-[180px] w-full flex-col items-center justify-center gap-2 rounded-3xl bg-white">
                {/* <div
                    className={cn(
                        "absolute left-4 top-4 flex  gap-2 uppercase items-center font-medium text-neutral-500"
                    )}
                >
                    <h2>{l("title_achievements")}</h2>{" "}
                </div> */}
                <div className="mt-1 flex flex-col items-center justify-center">
                    {/* <GiAchievement className=" text-neutral-300/75 size-[68px]" /> */}
                    <h2 className="items-center font-medium uppercase text-neutral-500">
                        your ad could be here
                    </h2>
                    <span
                        onClick={() => {
                            hapticFeedback();
                        }}
                        className="font-medium text-tgaccent underline underline-offset-2"
                    >
                        contact us
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AdPlaceholder;
