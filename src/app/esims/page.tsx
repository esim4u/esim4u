import Home from "@/screens/home";
import { Metadata } from "next";
import React from "react";

type Props = {};

export const metadata: Metadata = {
    title: "Home",
    description: "Esim4U Home Page",
};

const HomePage = (props: Props) => {
    return <Home />;
};

export default HomePage;
