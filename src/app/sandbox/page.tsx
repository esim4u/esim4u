"use client";

import { Button } from "@/components/ui/button";
import CircleProgressBar from "@/components/ui/circle-progress";
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
        </div>
    );
};

export default SandboxPage;
