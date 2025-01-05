"use client";

import { useTgBackButton } from "@/hooks/use-telegram";
import React from "react";

const WalletPage = () => {
	useTgBackButton();

	return <main className="container bg-background">Wallet</main>;
};

export default WalletPage;
