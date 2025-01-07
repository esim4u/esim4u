"use client";

import { TonIcon } from "@/components/icons";
import Dot from "@/components/ui/dot";
import {
	useGetConvertedAmount,
	useGetTonUsdRate,
} from "@/features/currency/hooks/use-currency";
import LoadingScreen from "@/features/navigation/components/loading-screen";
import { useGetCountryPackages } from "@/features/packages/hooks/use-packages";
import { useTgBackButton } from "@/hooks/use-telegram";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const CountryPackages = () => {
	useTgBackButton();

	const [selectedPackage, setSelectedPackage] = useState<any>(null);

	const { country_code } = useParams<{ country_code: string }>();

	const { data: countryPackages, isPending } =
		useGetCountryPackages(country_code);
	const packagePlans = useMemo(() => {
		if (!countryPackages || !countryPackages.operators) return [];
		//TODO: show operator with most amount of packages
		return countryPackages.operators[0].packages;
	}, [countryPackages]);

	const { data: rateTonUsd } = useGetTonUsdRate();
	const { data: convertedAmount } = useGetConvertedAmount({
		currency_code: "usd",
		amount: selectedPackage?.total_price,
	});
	const priceInTon = useMemo(() => {
		if (!rateTonUsd) return 999;

		const priceInTon = selectedPackage?.total_price / rateTonUsd;
		return priceInTon.toFixed(3);
	}, [rateTonUsd, selectedPackage]);

	useEffect(() => {
		if (packagePlans && packagePlans.length > 0) {
			setSelectedPackage(packagePlans[0]);
		}
	}, [packagePlans]);

	if (isPending) return <LoadingScreen />;

	return (
		<main className="container flex flex-col gap-3 bg-background">
			<PackageHeader countryPackages={countryPackages} />
			<PageBody>
				<div className="flex items-center gap-2">
					<h2 className="text-3xl font-bold">
						{convertedAmount?.amount}
						<span className="text-2xl">
							{convertedAmount?.symbol}
						</span>
					</h2>
					<Dot />
					<h2 className="flex items-center text-3xl font-bold">
						{priceInTon}
						<TonIcon className="h-6 w-6" />
					</h2>
				</div>
			</PageBody>
		</main>
	);
};

export default CountryPackages;

const PackageHeader = ({ countryPackages }: { countryPackages: any }) => {
	return (
		<div className="relative -mb-8 flex flex-col items-center justify-center">
			<Image
				width={300}
				height={150}
				className="h-48 w-full overflow-hidden rounded-lg object-cover"
				src={"/img/countries/global.png"}
				placeholder="blur"
				blurDataURL={"/img/countries/global.png"}
				alt={countryPackages.slug}
			/>
			<div className="absolute bottom-0 h-2/3 w-full bg-gradient-to-t from-black/75 "></div>

			<h1 className="absolute bottom-4 pb-6 text-center text-2xl uppercase text-white  shadow-black/50 text-shadow-sm ">
				{countryPackages.slug}
			</h1>
		</div>
	);
};

const PageBody = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="z-10 flex flex-col gap-4 rounded-t-3xl bg-background p-5">
			{children}
		</div>
	);
};
