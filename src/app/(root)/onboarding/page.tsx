"use client";

import React, { useEffect, useState } from "react";
import { l } from "@/features/locale/lib/locale";
import {
	Carousel,
	CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import {
	TonConnectButton,
	useTonAddress,
	useTonWallet,
} from "@tonconnect/ui-react";
import { cn } from "@/lib/utils";
import PopularCountriesGrid from "@/features/onbording/components/popular-countries-grid";
import RunningCountriesLines from "@/features/onbording/components/running-countries-lines";
import Dot from "@/components/ui/dot";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTelegram } from "@/hooks/use-telegram";
import { useFinishOnboarding } from "@/features/onbording/hooks/use-onboarding";
import { showConfirmationToast } from "@/features/onbording/lib/utils";

const OnboardingPage = () => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(1);
	const [count, setCount] = useState(1);

	const router = useRouter();
	const wallet = useTonWallet();
	const tonAddress = useTonAddress();

	const { tgUser } = useTelegram();

	const finishOnboarding = useFinishOnboarding();

	return (
		<main className="container bg-background">
			<OnboardingCarousel
				api={api}
				setApi={setApi}
				setCurrentPage={setCurrent}
				setCount={setCount}
			/>
			<div className="flex flex-row items-center justify-between px-5">
				<div className="flex flex-row gap-1.5 py-2 text-center text-sm text-muted-foreground">
					{Array(count)
						.fill(null)
						.map((_, index) => (
							<Dot
								key={index}
								className={cn(
									"size-3 bg-neutral-400 transition-all",
									index + 1 == current && "w-7 bg-tgaccent"
								)}
							></Dot>
						))}
				</div>
				{count !== current ? (
					<Button
						onClick={() => {
							api?.scrollNext();
						}}
						size={"bean"}
						variant={"telegram"}
					>
						{l("btn_next")}
					</Button>
				) : wallet ? (
					<Button
						onClick={() => {
							finishOnboarding.mutate({
								tgUser,
								tonAddress: tonAddress,
							});
							router.push("/esims");
						}}
						size={"bean"}
						variant={"telegram"}
					>
						{l("btn_start")}
					</Button>
				) : (
					<Button
						onClick={() => {
							showConfirmationToast({
								title: "Are you sure?",
								description:
									"If you connect wallet you can get bonuses for your referrals",
								onNo: () => {},
								onYes: () => {
									finishOnboarding.mutate({
										tgUser,
										tonAddress: tonAddress,
									});
									router.push("/esims");
								},
							});
						}}
						size={"bean"}
						variant={"unstyled"}
						className="font-semibold text-neutral-500 underline underline-offset-2"
					>
						{l("btn_skip")}
					</Button>
				)}
			</div>
		</main>
	);
};

export default OnboardingPage;

const OnboardingCarousel = ({
	api,
	setApi,
	setCurrentPage,
	setCount,
}: {
	api: CarouselApi;
	setApi: (api: CarouselApi) => void;
	setCurrentPage: (page: number) => void;
	setCount: (count: number) => void;
}) => {
	useEffect(() => {
		if (!api) {
			return;
		}

		setCount(api.scrollSnapList().length);
		setCurrentPage(api.selectedScrollSnap() + 1);

		api.on("select", () => {
			setCurrentPage(api.selectedScrollSnap() + 1);
		});
	}, [api]);

	return (
		<Carousel setApi={setApi} className="w-full">
			<CarouselContent className=" py-5">
				<CarouselItem className="flex w-full flex-col items-center">
					<div className="flex flex-col gap-5 p-5">
						<h2 className=" text-center text-4xl font-medium">
							{l("onboarding_title_1")}
						</h2>
						<p className="text-center text-neutral-500">
							{l("onboarding_description_1")}
						</p>
						<PopularCountriesGrid
							hasTitle={false}
							interactive={false}
						/>
					</div>
				</CarouselItem>
				<CarouselItem className="flex  w-full flex-col  items-center overflow-hidden">
					<div className="flex flex-col gap-5 overflow-hidden p-5">
						<h2 className=" text-center text-4xl font-medium">
							{l("onboarding_title_2")}
						</h2>
						<p className="text-center text-neutral-500">
							{l("onboarding_description_2")}
						</p>
						<RunningCountriesLines />
					</div>
				</CarouselItem>
				<CarouselItem className="flex w-full flex-col items-center">
					<div className="flex flex-col items-stretch justify-between gap-5 overflow-hidden p-5">
						<h2 className=" text-center text-4xl font-medium">
							<br /> {l("onboarding_title_3")}
						</h2>
						<p className="text-center text-neutral-500">
							{l("onboarding_description_3")}
						</p>
						<div className="flex flex-col items-center justify-center p-5 pt-24">
							<TonConnectButton />
						</div>
					</div>
				</CarouselItem>
			</CarouselContent>
		</Carousel>
	);
};
