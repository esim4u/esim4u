"use client"

import { useTgBackButton } from "@/hooks/use-telegram";
import React from "react";

const ProfilePage = () => {
	useTgBackButton();

	return (
		<main className="container bg-background">
			<div>
				<h1>Profile</h1>
			</div>
		</main>
	);
};

export default ProfilePage;
