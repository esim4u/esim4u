"use client";

import Collapse from "@/components/ui/collapse";
import CustomInput from "@/components/ui/custom-input";
import HomeHeader from "@/features/home/components/home-header";
import Stories from "@/features/home/components/stories";
import SubscribeBanner from "@/features/home/components/subscribe-banner";
import { getPreferredLanguage } from "@/features/locale/lib/locale";
import { useGetPackages } from "@/features/packages/hooks/use-packages";
import { useTgBackButton } from "@/hooks/use-telegram";
import React, { useMemo, useState } from "react";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { searchInPackages } from "@/features/packages/lib/utils";
import PackagesList from "@/features/packages/components/packages-list";
import PopularCountriesGrid from "@/features/onbording/components/popular-countries-grid";
import { hapticFeedback } from "@telegram-apps/sdk-react";

const HomePage = () => {
	useTgBackButton({
		isVisible: false,
	});

	const [search, setSearch] = useState("");
	const [isSearchError, setIsSearchError] = useState(false);
	const [isSearchFocused, setIsSearchFocused] = useState(false);

	const { data: packages } = useGetPackages({ lang: getPreferredLanguage() });

	const filteredPackages = useMemo(() => {
		if (!search) return [];
		if (search && packages && packages.length) {
			return searchInPackages({
				packages,
				search,
			});
		}
	}, [packages, search]);

	return (
		<main className="container flex flex-col bg-background gap-4">
			<Collapse className="-mx-5 " isOpen={!isSearchFocused}>
				<div className="flex flex-col gap-2 ">
					<HomeHeader className="px-5 pt-2" />
					<Stories className="pl-4" />
					<SubscribeBanner className="mx-5" />
				</div>
			</Collapse>

			<CustomInput
				id="country-search"
				icon={HiMiniMagnifyingGlass}
				value={search}
				setValue={(value) => {
					setSearch(value);

					if (value.length > 2 && filteredPackages?.length === 0) {
						setIsSearchError(true);
						if (
							hapticFeedback.isSupported() &&
							hapticFeedback.notificationOccurred.isAvailable()
						) {
							hapticFeedback.notificationOccurred("warning");
						}
					} else {
						setIsSearchError(false);
					}
				}}
				isFocused={isSearchFocused}
				onFocus={() => {
					setIsSearchFocused(true);
				}}
				setIsFocused={setIsSearchFocused}
				isError={isSearchError}
			/>

			{isSearchFocused && filteredPackages && (
				<PackagesList packages={filteredPackages} search={search} />
			)}

			<Collapse className=" duration-200" isOpen={!isSearchFocused}>
				<div className="flex flex-col gap-4 pb-4">
					<PopularCountriesGrid />
				</div>
			</Collapse>
		</main>
	);
};

export default HomePage;
