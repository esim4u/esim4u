"use client";

import { Esim } from "@/types";
import { useState } from "react";
import Collapse from "../ui/collapse";
import { hapticFeedback } from "@/lib/utils";
import Image from "next/image";

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
}: Esim) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="flex flex-col">
            <div
                onClick={() => {
                    hapticFeedback();
                    setIsOpen(!isOpen);
                }}
                className="bg-white z-10 p-5 rounded-3xl"
            >
                <div className="flex flex-col gap-2">Status: {state}</div>
                <div></div>
            </div>
            <Collapse className="bg-blue-100 px-4 pt-5 -mt-5" isOpen={isOpen}>
                <div className="">awd</div>
            </Collapse>
            <div className="bg-blue-100 p-4 rounded-b-3xl flex items-center justify-between">
                <div className="flex gap-2 items-center">
                    <Image
                        width={40}
                        height={40}
                        src={image_url}
                        alt={coverage}
                    />
                    <h3>{coverage}</h3>
                </div>
                <div>
                    <h3>
                        {validity} DAYS / {data}
                    </h3>
                </div>
            </div>
        </div>
    );
};

export default EsimCard;
