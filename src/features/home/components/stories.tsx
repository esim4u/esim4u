"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import ReactCountryFlag from "react-country-flag";

import { cn } from "@/lib/utils";
import { useTgUser } from "@/hooks/use-telegram";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import { Skeleton } from "@/components/ui/skeleton";
import {
	getCountryFromLanguage,
	getPreferredLanguage,
} from "@/features/locale/lib/locale";
import {
	getStories,
	incrementStoryTotalViews,
	incrementStoryUniqueViews,
} from "../services/stories";
import { updateUserActivity } from "../services/activity";
import { Button } from "@/components/ui/button";
import { openLink } from "@telegram-apps/sdk-react";

type Props = {
	className?: string;
};

const Stories = ({ className }: Props) => {
	const [checkedStories, setCheckedStories] = useState<string[]>([]);

	const { tgUser } = useTgUser();

	const { data: stories, isPending } = useQuery({
		queryKey: ["stories"],
		queryFn: async () => {
			const data = await getStories(getPreferredLanguage());
			return data;
		},
		placeholderData: keepPreviousData,
	});

	const filteredStories = useMemo(() => {
		if (!stories) return [];

		let checked = stories.filter((story) =>
			checkedStories.includes(story.id.toString().trim())
		);
		checked = checked.sort((a, b) => {
			return a.language === "EN" ? 1 : -1;
		});

		let unchecked = stories.filter(
			(story) => !checkedStories.includes(story.id.toString().trim())
		);
		unchecked = unchecked.sort((a, b) => {
			return a.language === "EN" ? 1 : -1;
		});

		return [...unchecked, ...checked];
	}, [stories, checkedStories]);

	if (isPending)
		return (
			<div>
				<Carousel className="w-full">
					<CarouselContent className={cn("-ml-1", className)}>
						{Array(4)
							.fill(null)
							.map((placeholder, index) => {
								return (
									<CarouselItem
										key={index}
										className="basis-24  cursor-pointer pl-1 transition-transform active:scale-95 "
									>
										<div className="p-1">
											<div
												className={cn(
													"rounded-full bg-neutral-400/15 p-1 transition-all"
												)}
											>
												<div
													className={cn(
														"relative  flex aspect-square items-end justify-center overflow-hidden rounded-full ring-2 ring-[#EFEFF3] "
													)}
												>
													<div>
														<Skeleton className="h-full w-full" />
													</div>
												</div>
											</div>
										</div>
									</CarouselItem>
								);
							})}
					</CarouselContent>
				</Carousel>
			</div>
		);

	return (
		<div>
			<Carousel className="w-full">
				<CarouselContent className={cn("-ml-1", className)}>
					{filteredStories?.map((story, index) => {
						return (
							<Button
								onClick={async () => {
									openLink(story.telegraph_url, {
										tryInstantView: true,
									});
									await incrementStoryTotalViews(story.id);

									if (
										!checkedStories.includes(
											story.id.toString().trim()
										)
									) {
										await incrementStoryUniqueViews(
											story.id
										);
									}

									const unique = new Set([
										...checkedStories,
										story.id.toString().trim(),
									]);
									const newCheckedStories =
										Array.from(unique);

									setCheckedStories(newCheckedStories);

									await updateUserActivity({
										telegram_id: tgUser?.id || 0,
										story_id: story.id,
									});
								}}
								asChild
								key={index}
								variant="unstyled"
							>
								<CarouselItem className="flex h-full basis-24 pl-1 transition-transform active:scale-95">
									<div className="h-full p-1">
										<div
											className={cn(
												"flex h-full rounded-full p-1 transition-all",
												checkedStories.length > 0 &&
													!checkedStories.includes(
														story.id
															.toString()
															.trim()
													)
													? " bg-gradient-to-tr from-pink-500  via-sky-500 to-emerald-500"
													: "bg-neutral-400/15"
											)}
										>
											<div className="relative flex h-[76px] w-fit">
												<div
													className={cn(
														"relative flex aspect-square h-full items-end justify-center overflow-hidden rounded-full ring-2 ring-[#EFEFF3] "
													)}
												>
													<div className="relative flex h-full w-full">
														<Image
															width={216}
															height={216}
															className=" h-full w-full object-cover"
															placeholder="blur"
															blurDataURL={
																story?.photo_url
															}
															quality={25}
															src={
																story?.photo_url
															}
															alt="news"
														/>
														<div className="absolute bottom-0 h-2/3 w-full bg-gradient-to-t from-black/55">
															{" "}
														</div>
													</div>

													<span className="absolute pb-2 text-center text-[10px] font-medium uppercase leading-3 text-white shadow-black text-shadow ">
														{story?.title}
													</span>
												</div>
												{story?.language &&
													story?.language != "EN" && (
														<ReactCountryFlag
															countryCode={getCountryFromLanguage(
																story?.language
															)}
															svg
															className="absolute bottom-[3px] right-[3px] h-full rounded-full object-cover"
														/>
													)}
											</div>
										</div>
									</div>
								</CarouselItem>
							</Button>
						);
					})}
				</CarouselContent>
			</Carousel>
		</div>
	);
};

export default Stories;
