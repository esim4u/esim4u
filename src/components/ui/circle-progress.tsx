import { cn } from "@/lib/utils";
import React from "react";

type Props = {
    percent: number;
    size?: number;
    strokeWidth?: number;
    bgColor?: string;
    progressColor?: string;
    textColor?: string;
    labelText?: string;
    children?: React.ReactNode;
};

const CircleProgressBar = ({
    percent,
    size = 120,
    strokeWidth = 10,
    bgColor = "text-neutral-100",
    progressColor,
    textColor,
    labelText,
    children,
}: Props) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    const getProgressColor = () => {
        if (percent > 30) {
            return " bg-gradient-to-tr from-green-600 to-green-400  text-transparent bg-clip-text ";
        } else if (percent > 10) {
            return " bg-gradient-to-tr from-amber-500 to-yellow-400  text-transparent bg-clip-text ";
        } else {
            return " bg-gradient-to-tr from-red-600 to-red-400  text-transparent bg-clip-text ";
        }
    };
    const strokeColor = () => {
        if (percent > 30) {
            return "url(#progressGradientGreen)";
        } else if (percent > 10) {
            return "url(#progressGradientYellow)";
        } else if (percent > 0) {
            return "url(#progressGradientRed)";
        } else {
            return "url(#progressGradientNone)";
        }
    };

    return (
        <div className=" relative shadow-md shadow-black/5  flex items-center justify-center overflow-hidden rounded-full">
            <svg
                className={cn("transform ")}
                width={size}
                height={size}
                aria-hidden="true"
            >
                <defs>
                    <linearGradient
                        id="progressGradientGreen"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop offset="0%" style={{ stopColor: "#10efac" }} />
                        <stop offset="100%" style={{ stopColor: "#0cb180" }} />
                    </linearGradient>
                    <linearGradient
                        id="progressGradientYellow"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop offset="0%" style={{ stopColor: "#fffa41" }} />
                        <stop offset="100%" style={{ stopColor: "#ffdf00" }} />
                    </linearGradient>
                    <linearGradient
                        id="progressGradientRed"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                    >
                        <stop offset="0%" style={{ stopColor: "#ff7878" }} />
                        <stop offset="100%" style={{ stopColor: "#ff0000" }} />
                    </linearGradient>
                    <filter
                        id="shadow"
                        x="-20%"
                        y="-20%"
                        width="140%"
                        height="140%"
                    >
                        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                        <feOffset dx="1" dy="1" result="offsetblur" />
                        <feComponentTransfer>
                            <feFuncA type="linear" slope="0.2" />
                        </feComponentTransfer>
                        <feMerge>
                            <feMergeNode />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                <circle
                    className={bgColor}
                    strokeWidth={strokeWidth}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    className={cn("transition-all duration-500 ")}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke={strokeColor()}
                    fill="transparent"
                    filter={"url(#shadow)"}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
            </svg>

            <div className={`absolute `}>
                {children ? (
                    <div
                        className={cn(
                            "transition-all duration-500 ",
                            textColor ? textColor : getProgressColor()
                        )}
                    >
                        {children}
                    </div>
                ) : (
                    <span
                        className={cn(
                            `flex items-center -mr-2.5 text-2xl font-semibold transition-all duration-500 `,
                            textColor ? textColor : getProgressColor()
                        )}
                    >
                        {percent}{" "}
                        <span className="text-base font-bold mt-0.5">%</span>
                    </span>
                )}
            </div>
        </div>
    );
};

export default CircleProgressBar;
