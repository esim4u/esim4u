import React from "react";

import { cn } from "@/lib/utils";
import { Icon } from "@/types";

const WalletIcon = ({ className, onClick }: Icon) => {
    return (
        <div onClick={onClick} className={cn("h-5 w-5", className)}>
            <svg
                className="aspect-square h-full w-full"
                width="39"
                height="32"
                viewBox="0 0 39 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M28.2792 12.6509C26.4326 12.6509 24.9303 14.1531 24.9303 15.9997C24.9303 17.8464 26.4326 19.3486 28.2792 19.3486H38.6978V12.651L28.2792 12.6509ZM29.7675 17.116H28.2792C27.6626 17.116 27.1629 16.6162 27.1629 15.9997C27.1629 15.3833 27.6627 14.8835 28.2792 14.8835H29.7675C30.384 14.8835 30.8838 15.3833 30.8838 15.9997C30.8838 16.6162 30.384 17.116 29.7675 17.116Z"
                    fill="currentColor"
                />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M26.58 10.683C26.5725 10.3779 26.3259 10.1028 25.9854 10.1028H15.4296L15.2012 31.5735L22.9111 17.5306C22.7721 17.044 22.6977 16.5305 22.6977 16C22.6977 13.5146 24.3307 11.4034 26.58 10.683ZM25.2456 20.6832L19.0324 32H33.1163C36.1939 32 38.6977 29.4962 38.6977 26.4186V21.5814H28.2791C27.1615 21.5814 26.1195 21.2512 25.2456 20.6832ZM7.85318 32L0 17.1662V26.4186C0 29.4962 2.50379 32 5.58139 32H7.85318ZM0 6.73579V5.58139C0 2.50379 2.50379 0 5.58139 0H33.1163C36.1939 0 38.6977 2.50379 38.6977 5.58139V10.4186H30.1391C29.996 8.35703 28.3009 6.53914 25.9854 6.53914H13.6667H1.27924C0.827019 6.53914 0.398253 6.6086 0 6.73579ZM0.754324 10.9746C0.544907 10.5791 0.831663 10.1028 1.27924 10.1028H11.8658L11.6378 31.5323L0.754324 10.9746Z"
                    fill="currentColor"
                />
            </svg>
        </div>
    );
};

export default WalletIcon;
