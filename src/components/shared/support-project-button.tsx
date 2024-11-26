"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { FaDonate } from "react-icons/fa";

import { Button } from "../ui/button";

type Props = {};

const SupportProjectButton = (props: Props) => {
    const router = useRouter();

    return (
        <Button
            onClick={() => {
                router.push("/donation");
            }}
            size={"lg"}
            className="w-full gap-1 rounded-xl text-base"
        >
            Support the project <FaDonate className="h-[14px] w-[14px]" />
        </Button>
    );
};

export default SupportProjectButton;
