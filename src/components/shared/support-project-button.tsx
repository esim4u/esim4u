"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTelegram } from "@/providers/telegram-provider";
import { FaDonate } from "react-icons/fa";

import { hapticFeedback } from "@/lib/utils";

import { Button } from "../ui/button";

type Props = {};

const SupportProjectButton = (props: Props) => {
    const { user: tgUser, webApp } = useTelegram();
    const router = useRouter();

    return (
        <Button
            onClick={() => {
                hapticFeedback();
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
