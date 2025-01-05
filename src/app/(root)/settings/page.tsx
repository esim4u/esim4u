"use client";

import { useTgBackButton } from "@/hooks/use-telegram";
import React from "react";

const SettingsPage = () => {
	useTgBackButton();

	return <main className="container bg-background">Settings</main>;
};

export default SettingsPage;
