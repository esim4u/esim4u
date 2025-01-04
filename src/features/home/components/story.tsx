import { Skeleton } from "@/components/ui/skeleton";
import { getCountryFromLanguage } from "@/features/locale/lib/locale";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import ReactCountryFlag from "react-country-flag";

type Props = {
	story: any;
	isStoryChecked: boolean;
};

const Story = ({ story, isStoryChecked }: Props) => {
	return (
		<div
			className={cn(
				"flex h-full rounded-full p-1 transition-all",
				isStoryChecked
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
							blurDataURL={story?.photo_url}
							quality={25}
							src={story?.photo_url}
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
				{story?.language && story?.language != "EN" && (
					<ReactCountryFlag
						countryCode={getCountryFromLanguage(story?.language)}
						svg
						className="absolute bottom-[3px] right-[3px] h-full rounded-full object-cover"
					/>
				)}
			</div>
		</div>
	);
};

export const SkeletonStory = () => {
	return (
		<div
			className={cn("rounded-full bg-neutral-400/15 p-1 transition-all")}
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
	);
};

export default Story;
