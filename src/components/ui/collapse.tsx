"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";

type Props = {
    className?: string;
    isOpen: boolean;
    children: React.ReactNode;
};

const Collapse = ({className, isOpen, children}: Props) => {

    return <div className={cn('grid overflow-hidden transition-all duration-300 ease-in-out', isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-100', className)}>
        <div className="overflow-hidden">{children}</div>
    </div>;
};

export default Collapse;
