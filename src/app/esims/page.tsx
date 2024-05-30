import { Metadata } from "next";
import React from "react";

import dynamic from "next/dynamic";
const Home = dynamic(() => import("@/screens/home"), { ssr: false });

export const metadata: Metadata = {
    title: "Home",
    description: "Esim4U Home Page",
};

export default function HomePage() {
    return <Home />;
}
