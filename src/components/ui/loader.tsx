"use client"

import React from "react";
import Lottie from "lottie-react";

import amongUsAnim from "@/assets/anim/among-us.json";
import { cn } from "@/lib/utils";

type Props = {
    className?: string;
};

const Loader = ({ className }: Props) => {
    return (
        <div className={cn("w-56 h-56", className)}>
            <Lottie className="-mt-14" animationData={amongUsAnim} />
        </div>
    );
};

export default Loader;
