"use client";

import Collapse from "@/components/ui/collapse";
import HomeHeader from "@/features/home/components/home-header";
import Stories from "@/features/home/components/stories";
import SubscribeBanner from "@/features/home/components/subscribe-banner";
import React, { useState } from "react";

const HomePage = () => {
	const [search, setSearch] = useState("");
	const [isSearchError, setIsSearchError] = useState(false);
	const [isSearchFocused, setIsSearchFocused] = useState(false);

	return (
		<main className="container flex flex-col bg-background gap-2">
			<Collapse className="-mx-5 " isOpen={!isSearchFocused}>
				<div className="flex flex-col gap-2 ">
					<HomeHeader className="px-5 pt-2" />
					<Stories className="pl-4" />
					<SubscribeBanner className="mx-5" />
				</div>
			</Collapse>
		</main>
	);
};

export default HomePage;
