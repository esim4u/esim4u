"use client";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	getPreferredCurrencyCode,
	getSupportedCurrencies,
	setPreferredCurrency,
} from "@/features/currency/lib/currency";
import { LANGUAGES } from "@/features/locale/constants";
import {
	getPreferredLanguage,
	getSupportedLanguages,
	l,
	setLanguage,
} from "@/features/locale/lib/locale";
import { useTgBackButton } from "@/hooks/use-telegram";
import { locationManager } from "@telegram-apps/sdk";
import { openTelegramLink } from "@telegram-apps/sdk-react";
import { useRouter } from "next/navigation";
import React from "react";
import { BiSupport } from "react-icons/bi";
import { toast } from "sonner";

const SettingsPage = () => {
	const router = useRouter();

	useTgBackButton();

	return (
		<main className="container flex flex-col gap-2 bg-background">
			<Select
				onValueChange={(value) => {
					setLanguage(value, router);
				}}
				defaultValue={getPreferredLanguage()}
				onOpenChange={() => {}}
			>
				<SelectTrigger className="w-full">
					<SelectValue placeholder={l("input_title_language")} />
				</SelectTrigger>
				<SelectContent className="max-h-72">
					<SelectGroup>
						{getSupportedLanguages().map((lang: any) => (
							<SelectItem key={lang.value} value={lang.value}>
								<div className="flex items-center gap-1">
									<span className="font-bold">
										{LANGUAGES[lang.value]}
									</span>
								</div>
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			<Select
				onValueChange={(value) => {
					setPreferredCurrency(value, router);
				}}
				defaultValue={getPreferredCurrencyCode()}
			>
				<SelectTrigger className="w-full">
					<SelectValue placeholder={l("input_title_currency")} />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						{getSupportedCurrencies().map((currency: any) => (
							<SelectItem
								key={currency.value}
								value={currency.value}
							>
								<div className="flex items-center gap-1">
									<span className="text-[17px] font-bold">
										{currency.symbol}
									</span>
									<span className="font-bold">
										{currency.label}
									</span>
								</div>
							</SelectItem>
						))}
					</SelectGroup>
				</SelectContent>
			</Select>
			<Button
				onClick={async () => {
					if (locationManager.requestLocation.isAvailable()) {
						const location =
							await locationManager.requestLocation();

						toast.info(
							<pre>{JSON.stringify(location, null, 2)}</pre>
						);
					} else {
						toast.info(
							<pre>
								{JSON.stringify(
									{
										error: true,
										message:
											"Location manager is not available",
									},
									null,
									2
								)}
							</pre>
						);
					}
				}}
				size={"lg"}
				className="w-full rounded-xl gap-1"
			>
				{"Request Location"}
			</Button>
			<Button
				onClick={async () => {
					if (locationManager.openSettings.isAvailable()) {
						locationManager.openSettings();
					}
				}}
				size={"lg"}
				className="w-full rounded-xl gap-1"
			>
				{"Open Location Settings"}
			</Button>
			<Button
				onClick={() => {
					openTelegramLink("https://t.me/esim4u_support_bot/chat");
				}}
				size={"lg"}
				className="w-full rounded-xl gap-1"
			>
				<BiSupport className="size-5" />
				{l("btn_support")}
			</Button>
			<Button
				onClick={() => {
					router.push("/chat");
				}}
				size={"lg"}
				className="w-full rounded-xl gap-1"
			>
				<BiSupport className="size-5" />
				Alternative {l("btn_support")}
			</Button>
		</main>
	);
};

export default SettingsPage;
