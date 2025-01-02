"use client";

import React, { useEffect, useState } from "react";
import { l } from "@/lib/locale";
import {
	Carousel,
	CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { TonConnectButton } from "@tonconnect/ui-react";
import { cn } from "@/lib/utils";
import PopularCountriesGrid from "@/features/onbording/components/popular-countries-grid";
import RunningCountriesLines from "@/features/onbording/components/running-countries-lines";

const OnboardingPage = () => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (!api) {
			return;
		}

		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap() + 1);

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap() + 1);
		});
	}, [api]);

	return (
		<main className="container py-5 bg-white h-screen">
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
		</main>
	);
};

export default OnboardingPage;
