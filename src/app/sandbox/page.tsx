"use client";

import EsimCard from "@/components/esims/esim-card";
import { Button } from "@/components/ui/button";
import CircleProgressBar from "@/components/ui/circle-progress";
import { ESIM_STATE } from "@/enums";
import { l, resetLanguage, setLanguage } from "@/lib/locale";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

const SandboxPage = (props: Props) => {
    const router = useRouter();

    const [percent, setPercent] = React.useState(50);

    return (
        <div className="p-20 flex flex-col gap-4">
            <CircleProgressBar percent={percent}>
                <span>10Gb</span>
            </CircleProgressBar>

            <Button
                onClick={() => {
                    setLanguage("en", router);
                }}
            >
                en
            </Button>
            <Button
                onClick={() => {
                    setLanguage("ua", router);
                }}
            >
                ua
            </Button>
            <Button
                onClick={() => {
                    setLanguage("hu", router);
                }}
            >
                hu
            </Button>
            <Button
                onClick={() => {
                    resetLanguage(router);
                }}
            >
                reset
            </Button>

            {l("hello_world")}

            {/* <EsimCard
                iccid={"89852350923520031607"}
                coverage={"12"}
                state={ESIM_STATE.NOT_ACTIVE}
                usage={{
                    total: 1024,
                    remaining: 1024,
                }}
            /> */}
        </div>
    );
};

export default SandboxPage;
