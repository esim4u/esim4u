"use client";

import EsimCard from "@/components/esims/esim-card";
import { Button } from "@/components/ui/button";
import CircleProgressBar from "@/components/ui/circle-progress";
import { ESIM_STATE } from "@/enums";
import React from "react";

type Props = {};

const SandboxPage = (props: Props) => {
    const [percent, setPercent] = React.useState(50);

    return (
        <div className="p-20">
            <CircleProgressBar percent={percent}>
                <span>10Gb</span>
            </CircleProgressBar>

            <Button
                onClick={() => {
                    setPercent((prev) => prev - 40);
                }}
            >
                -
            </Button>
            <Button
                onClick={() => {
                    setPercent((prev) => prev + 50);
                }}
            >
                +
            </Button>

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
