import React from "react";

type Props = {};

const CircleProgress = ({  }: Props) => {
    return (
        <div className="relative w-40 h-40">
            <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle
                    className="text-gray-200 stroke-current"
                    stroke-width="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                ></circle>
                <circle
                    className="text-indigo-500  progress-ring__circle stroke-current"
                    stroke-width="10"
                    stroke-linecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke-dasharray="251.2"
                    stroke-dashoffset="calc(251.2 - (251.2 * 70) / 100)"
                ></circle>

                <text
                    x="50"
                    y="50"
                    font-family="Verdana"
                    font-size="12"
                    text-anchor="middle"
                    alignment-baseline="middle"
                >
                    70%
                </text>
            </svg>
        </div>
    );
};

export default CircleProgress;
