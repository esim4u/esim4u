import Home from "@/screens/home";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
    title: "Home",
    description: "Esim4U Home Page",
};

export default function HomePage() {
    return <Home />;
}
