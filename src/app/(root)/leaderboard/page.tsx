"use client";

import LeaderboardBanner from "@/features/leaderboard/components/leaderboard-banner";
import LeaderBoardUser from "@/features/leaderboard/components/leaderboard-user";
import { useGetLeaderboard } from "@/features/leaderboard/hooks/use-leaderboard";
import { useGetUserById } from "@/features/users/hooks/use-users";
import { useTgBackButton, useTgUser } from "@/hooks/use-telegram";
import React from "react";

const LeaderboardPage = () => {
	useTgBackButton();
	const { tgUser } = useTgUser();

	const { data: leaders } = useGetLeaderboard();
	const { data: dbUserData } = useGetUserById(tgUser?.id);

	return (
		<main className="container flex flex-col bg-background gap-2 p-5">
			<LeaderboardBanner />
			<div className="flex w-full flex-col items-center gap-2">
				{leaders?.map((leader: any, index: number) => {
					return (
						<LeaderBoardUser
							key={leader.telegram_id}
							leader={leader}
							index={index}
							tgUser={tgUser}
							dbUserData={dbUserData}
						/>
					);
				})}
			</div>
		</main>
	);
};

export default LeaderboardPage;
