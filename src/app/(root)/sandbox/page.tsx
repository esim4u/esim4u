"use client";

import React, { useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTelegram } from "@/providers/telegram-provider";
import axios from "axios";

import {
    hapticFeedback,
    showConfirmationToast,
    successToast,
} from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";

type Props = {};

const SandboxPage = (props: Props) => {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();

    useEffect(() => {
        webApp?.onEvent("backButtonClicked", goBack);
        return () => {
            webApp?.offEvent("backButtonClicked", goBack);
        };
    }, [webApp]);

    const goBack = useCallback(() => {
        hapticFeedback("heavy");
        router.back();
    }, [webApp]);

    return (
        <div className="flex w-full flex-col items-center justify-center gap-4 p-5">
            <Loader />

            <Button
                onClick={async () => {
                    showConfirmationToast({
                        onNo: () => {},
                        onYes: async () => {
                            await axios
                                .get("/api/admin/newsletter/send")
                                .then(() => {
                                    successToast();
                                });
                        },
                    });
                }}
                variant={"destructive"}
                className="w-full rounded-full"
            >
                Send newsletters
            </Button>
            <div className="h-12 w-12 bg-tgbutton">tgbutton color</div>
            <div className="h-12 w-12 bg-tgaccent ">tgaccent color</div>
            <Button
                onClick={() => {
                    hapticFeedback();
                    router.push(
                        "/esims/pay/success" + ("1805" ? `?order_id=1805` : ""),
                    );
                }}
                variant={"destructive"}
                className="w-full rounded-full"
            >
                Redirect to pending
            </Button>
            <Button
                onClick={() => {
                    hapticFeedback();
                    router.push("/profile/wallet");
                }}
                variant={"destructive"}
                className="w-full rounded-full"
            >
                Wallet
            </Button>
        </div>
    );
};

export default SandboxPage;
