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
        if (percent > 70) {
            return "text-green-500";
        } else if (percent > 40) {
            return "text-yellow-500";
        } else {
            return "text-red-500";
        }
    };

    return (
        <div className="relative flex items-center justify-center overflow-hidden rounded-full">
            <svg
                className="transform"
                width={size}
                height={size}
                aria-hidden="true"
            >
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
                    className={cn(
                        "transition-all duration-500",
                        progressColor ? progressColor : getProgressColor()
                    )}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
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
