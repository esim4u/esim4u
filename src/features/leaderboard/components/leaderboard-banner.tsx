import React from "react";
import { GrTrophy } from "react-icons/gr";

const LeaderboardBanner = () => {
	return (
		<div className="flex w-full items-center justify-between rounded-xl bg-white px-5 py-3">
			<div className="p-2">
				<GrTrophy className=" h-12 w-12 text-amber-500 " />
			</div>

			<div className="flex-1 flex-col">
				<h2 className="text-center font-bold uppercase">
					invited the most frens
				</h2>
				<p className="text-pretty text-center text-sm leading-4">
					Invite more frens to get into the leader board!{" "}
				</p>
			</div>
		</div>
	);
};

export default LeaderboardBanner;
