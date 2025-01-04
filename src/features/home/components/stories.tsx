"use client";

import { useEffect, useMemo, useState } from "react";
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
import { cloudStorage, openLink } from "@telegram-apps/sdk-react";
import { useGetStories } from "../hooks/use-stories";
import Story, { SkeletonStory } from "./story";

type Props = {
	className?: string;
};

const Stories = ({ className }: Props) => {
	const { data: stories, isPending } = useGetStories({
		preferredLanguage: getPreferredLanguage(),
	});
	const { tgUser } = useTgUser();

	const [checkedStories, setCheckedStories] = useState<string[]>([]);

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

	useEffect(() => {
		if (cloudStorage.getItem.isAvailable()) {
			cloudStorage.getItem("checked_stories").then((value) => {
				if (value) {
					setCheckedStories(value.split(","));
				}
			});
		}
	}, [cloudStorage]);

	if (isPending) return <SkeletonStoriesCarousel className={className} />;

	return (
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
									await incrementStoryUniqueViews(story.id);
								}

								const unique = new Set([
									...checkedStories,
									story.id.toString().trim(),
								]);
								const newCheckedStories = Array.from(unique);

								setCheckedStories(newCheckedStories);

								if (cloudStorage.setItem.isAvailable()) {
									await cloudStorage.setItem(
										"checked_stories",
										newCheckedStories.join(",")
									);
								}

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
									<Story
										story={story}
										isStoryChecked={
											checkedStories.length > 0 &&
											!checkedStories.includes(
												story.id.toString().trim()
											)
										}
									/>
								</div>
							</CarouselItem>
						</Button>
					);
				})}
			</CarouselContent>
		</Carousel>
	);
};

export default Stories;

const SkeletonStoriesCarousel = ({ className }: { className?: string }) => {
	return (
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
									<SkeletonStory />
								</div>
							</CarouselItem>
						);
					})}
			</CarouselContent>
		</Carousel>
	);
};
