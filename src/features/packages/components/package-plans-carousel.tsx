"use client";

import {
	Carousel,
	CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { l } from "@/features/locale/lib/locale";
import { cn } from "@/lib/utils";
import { useState } from "react";

const PackagePlansCarousel = ({
	packagePlans,
	selectedPackage,
	setSelectedPackage,
}: {
	packagePlans: any[];
	selectedPackage: any;
	setSelectedPackage: any;
}) => {
	const [api, setApi] = useState<CarouselApi>();

	return (
		<div className={cn("flex flex-col gap-1", "-mx-5")}>
			<h2
				className={cn(
					"pl-2 text-sm font-medium uppercase text-neutral-500",
					"px-7"
				)}
			>
				{l("title_packages")}
			</h2>
			<Carousel setApi={setApi}>
				<CarouselContent className={cn("ml-1", "mr-4 pl-4")}>
					{packagePlans &&
						packagePlans.map((plan: any, index: number) => {
							return (
								<CarouselItem
									key={index}
									className="basis-[122px] cursor-pointer pl-1"
								>
									<div
										onClick={() => {
											setSelectedPackage(plan);
											api?.scrollTo(index);
										}}
										className={cn(
											"flex h-16  w-28 flex-col items-center justify-center rounded-3xl  border-[2px] border-neutral-400 p-5 transition-all active:border-4 active:border-tgaccent ",
											selectedPackage === plan &&
												"border-4 border-tgaccent"
										)}
									>
										<h2 className="text-2xl font-bold">
											{plan.amount / 1024}
											<span className="text-xl">GB</span>
										</h2>
										<p className=" text-xs font-medium text-neutral-500">
											{plan.day} {l("text_days")}
										</p>
									</div>
								</CarouselItem>
							);
						})}
				</CarouselContent>
			</Carousel>
		</div>
	);
};

export default PackagePlansCarousel;
