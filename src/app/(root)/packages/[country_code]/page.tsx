"use client";

import { TonIcon } from "@/components/icons";
import { Checkbox } from "@/components/ui/checkbox";
import Dot from "@/components/ui/dot";
import { useGetConvertedAmount } from "@/features/currency/hooks/use-currency";
import { getPreferredCurrencyCode } from "@/features/currency/lib/currency";
import EsimActivationManualCollapse from "@/features/esims/components/esim-activation-manual-collapse";
import OneTimeInstallationWarningBanner from "@/features/esims/components/one-time-installation-warning-banner";
import { l } from "@/features/locale/lib/locale";
import LoadingScreen from "@/features/navigation/components/loading-screen";
import PackageAdditionalInfo from "@/features/packages/components/package-additional-info";
import PackagePlansCarousel from "@/features/packages/components/package-plans-carousel";
import { useGetCountryPackages } from "@/features/packages/hooks/use-packages";
import { useTgBackButton } from "@/hooks/use-telegram";
import Image from "next/image";
import { useParams } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";

const CountryPackages = () => {
	useTgBackButton();

	const [selectedPackage, setSelectedPackage] = useState<any>(null);
	const [terms, setTerms] = useState({
		conditions_and_terms: false,
		device_compatibility: false,
	});

	const { country_code } = useParams<{ country_code: string }>();

	const { data: countryPackages, isPending } =
		useGetCountryPackages(country_code);
	const packagePlans = useMemo(() => {
		if (!countryPackages || !countryPackages.operators) return [];
		//TODO: show operator with most amount of packages
		return countryPackages.operators[0].packages;
	}, [countryPackages]);

	const { data: convertedAmount } = useGetConvertedAmount({
		currency_code: getPreferredCurrencyCode(),
		amount: selectedPackage?.total_price,
	});
	const { data: amountInTon } = useGetConvertedAmount({
		currency_code: "ton",
		amount: selectedPackage?.total_price,
	});

	useEffect(() => {
		if (packagePlans && packagePlans.length > 0) {
			setSelectedPackage(packagePlans[0]);
		}
	}, [packagePlans]);

	if (isPending) return <LoadingScreen />;

	return (
		<main className="container p-0 flex flex-col gap-3 bg-background">
			<PackageHeader countryPackages={countryPackages} />
			<PageBody>
				<div className="flex items-center gap-2">
					<h2 className="text-3xl font-bold">
						{convertedAmount?.amount || "0.00"}
						<span className="text-2xl">
							{convertedAmount?.symbol || "$"}
						</span>
					</h2>
					<Dot />
					<h2 className="flex items-center text-3xl font-bold">
						{amountInTon?.amount || "0.00"}
						<TonIcon className="h-6 w-6" />
					</h2>
				</div>
				<PackagePlansCarousel
					packagePlans={packagePlans}
					selectedPackage={selectedPackage}
					setSelectedPackage={setSelectedPackage}
				/>
				<PackageAdditionalInfo packageData={countryPackages} />
				<EsimActivationManualCollapse />
				<OneTimeInstallationWarningBanner />
				<Terms terms={terms} setTerms={setTerms} />
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

const Terms = ({ terms, setTerms }: { terms: any; setTerms: any }) => {
	return (
		<div className="flex flex-col gap-2 rounded-3xl border-2 border-redish p-5">
			<div className="flex items-center space-x-2">
				<Checkbox
					onCheckedChange={(checked: boolean) => {
						setTerms({
							...terms,
							conditions_and_terms: checked,
						});
					}}
					checked={terms.conditions_and_terms}
					id="conditions_and_terms"
				/>
				<label
					htmlFor="conditions_and_terms"
					className="cursor-pointer text-sm font-medium "
				>
					{l("text_terms_conditions")}
				</label>
			</div>
			<div className=" flex items-center space-x-2">
				<Checkbox
					onCheckedChange={(checked: boolean) => {
						setTerms({
							...terms,
							device_compatibility: checked,
						});
					}}
					checked={terms.device_compatibility}
					id="device_compatibility"
				/>
				<label
					htmlFor="device_compatibility"
					className="cursor-pointer text-sm font-medium "
				>
					{l("text_device_compatible")}
				</label>
			</div>
		</div>
	);
};
