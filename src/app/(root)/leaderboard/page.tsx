"use client"

import { useTgBackButton } from "@/hooks/use-telegram";
import React from "react";

const LeaderboardPage = () => {
	useTgBackButton();

	return (
		<main className="container bg-background">
			<div>
				<h1>Leaderboard</h1>
			</div>
		</main>
	);
};

export default LeaderboardPage;
