"use client";

import React, { Suspense, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTelegram } from "@/providers/telegram-provider";
import axios from "axios";

import { l, resetLanguage } from "@/lib/locale";
import {
    cn,
    hapticFeedback,
    showConfirmationToast,
    successToast,
} from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import CircleProgressBar from "@/components/ui/circle-progress";
import Loader from "@/components/ui/loader";
import { Skeleton } from "@/components/ui/skeleton";
import UserEsims from "@/components/esims/user-esims";
import RefLinkButton from "@/components/shared/ref-link-button";

type Props = {};

const SandboxPage = (props: Props) => {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();

    const [percent, setPercent] = React.useState(50);

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
        </div>
    );
};

export default SandboxPage;
