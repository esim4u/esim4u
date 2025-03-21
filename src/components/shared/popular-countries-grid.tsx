import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdArrowForwardIos } from "react-icons/md";

import { l } from "@/features/locale/lib/locale";
import { Button } from "../ui/button";
import { hapticFeedback } from "@telegram-apps/sdk-react";

type Props = {
	hasTitle?: boolean;
	interactive?: boolean;
};

const PopularCountriesGrid = ({
	hasTitle = true,
	interactive = true,
}: Props) => {
	const router = useRouter();

	return (
		<div className="flex flex-col gap-2">
			{hasTitle && (
				<h2 className="pl-4 font-medium uppercase text-neutral-500">
					{l("title_popular_countries")}
				</h2>
			)}

			<div className="grid max-h-96 grid-cols-4 grid-rows-4 gap-2">
				<div
					onClick={() => {
						if (!interactive) return;

						if (hapticFeedback.isSupported()) {
							hapticFeedback.impactOccurred("medium");
						}
						router.push("/packages/eg");
					}}
					className=" relative flex cursor-pointer items-end justify-center overflow-hidden rounded-3xl transition-transform active:scale-95	"
				>
					<Image
						width={312}
						height={312}
						className="h-full w-full bg-neutral-300 object-cover"
						src={"/img/countries/eg.jpeg"}
						quality={50}
						placeholder="blur"
						blurDataURL="/img/countries/eg.jpeg"
						alt="news"
					/>
					<div className="absolute h-1/2 w-full bg-gradient-to-t from-black/50">
						{" "}
					</div>

					{interactive && (
						<>
							<div className=" absolute right-3 top-3 h-[18px] w-[18px] bg-white/75 blur-sm	 "></div>
							<div className=" absolute right-3 top-3">
								<MdArrowForwardIos className=" h-4 w-4 " />
							</div>
						</>
					)}

					<span className="absolute pb-2 text-[10px] font-medium uppercase text-white">
						EGYPT
					</span>
				</div>
				<div
					onClick={() => {
						if (!interactive) return;
						if (hapticFeedback.isSupported()) {
							hapticFeedback.impactOccurred("medium");
						}
						router.push("/packages/ch");
					}}
					className=" relative flex cursor-pointer items-end  justify-center overflow-hidden rounded-3xl transition-transform active:scale-95 "
				>
					<Image
						width={312}
						height={312}
						className="h-full w-full bg-neutral-300 object-cover"
						quality={50}
						placeholder="blur"
						blurDataURL="/img/countries/ch.png"
						src={"/img/countries/ch.png"}
						alt="news"
					/>
					<div className="absolute h-1/2 w-full bg-gradient-to-t from-black/50">
						{" "}
					</div>

					{interactive && (
						<>
							<div className=" absolute right-3 top-3 h-[18px] w-[18px] bg-white/75 blur-sm	 "></div>
							<div className=" absolute right-3 top-3">
								<MdArrowForwardIos className=" h-4 w-4 " />
							</div>
						</>
					)}

					<span className="absolute pb-2 text-[10px] font-medium uppercase text-white">
						SWITZERLAND
					</span>
				</div>
				<div
					onClick={() => {
						if (!interactive) return;
						if (hapticFeedback.isSupported()) {
							hapticFeedback.impactOccurred("medium");
						}
						router.push("/packages/es");
					}}
					className=" relative col-span-2 row-span-2 flex cursor-pointer items-end justify-center overflow-hidden rounded-3xl transition-transform active:scale-95 	"
				>
					<Image
						width={312}
						height={312}
						className="h-full w-full bg-neutral-300 object-cover"
						quality={50}
						placeholder="blur"
						blurDataURL="/img/countries/es.png"
						src={"/img/countries/es.png"}
						alt="news"
					/>
					<div className="absolute h-1/2 w-full bg-gradient-to-t from-black/50">
						{" "}
					</div>

					{interactive && (
						<>
							<div className=" absolute right-3 top-3 h-[18px] w-[18px] bg-white/75 blur-sm	 "></div>
							<div className=" absolute right-3 top-3">
								<MdArrowForwardIos className=" h-4 w-4 " />
							</div>
						</>
					)}

					<span className="absolute pb-3 text-lg font-medium uppercase text-white">
						SPAIN
					</span>
				</div>
				<div
					onClick={() => {
						if (!interactive) return;
						if (hapticFeedback.isSupported()) {
							hapticFeedback.impactOccurred("medium");
						}
						router.push("/packages/it");
					}}
					className="relative col-span-2 row-span-1 flex cursor-pointer items-end  justify-center overflow-hidden rounded-3xl transition-transform active:scale-95 	"
				>
					<Image
						width={312}
						height={312}
						className="h-full w-full bg-neutral-300 object-cover"
						quality={50}
						placeholder="blur"
						blurDataURL="/img/countries/it.png"
						src={"/img/countries/it.png"}
						alt="news"
					/>
					<div className="absolute h-1/2 w-full bg-gradient-to-t from-black/50">
						{" "}
					</div>

					{interactive && (
						<>
							<div className=" absolute right-3 top-3 h-[18px] w-[18px] bg-white/75 blur-sm	 "></div>
							<div className=" absolute right-3 top-3">
								<MdArrowForwardIos className=" h-4 w-4 " />
							</div>
						</>
					)}

					<span className="absolute pb-2 text-xs font-medium uppercase text-white">
						ITALY
					</span>
				</div>
				<div
					onClick={() => {
						if (!interactive) return;
						if (hapticFeedback.isSupported()) {
							hapticFeedback.impactOccurred("medium");
						}
						router.push("/packages/ae");
					}}
					className="relative col-span-2 row-span-2 flex cursor-pointer items-end  justify-center overflow-hidden rounded-3xl transition-transform active:scale-95 	"
				>
					<Image
						width={312}
						height={312}
						className="h-full w-full bg-neutral-300 object-cover"
						quality={50}
						placeholder="blur"
						blurDataURL="/img/countries/ae.png"
						src={"/img/countries/ae.png"}
						alt="news"
					/>
					<div className="absolute h-1/2 w-full bg-gradient-to-t from-black/50">
						{" "}
					</div>

					{interactive && (
						<>
							<div className=" absolute right-3 top-3 h-[18px] w-[18px] bg-white/75 blur-sm	 "></div>
							<div className=" absolute right-3 top-3">
								<MdArrowForwardIos className=" h-4 w-4 " />
							</div>
						</>
					)}

					<span className="absolute pb-2 text-xs font-medium uppercase text-white">
						EMIRATES
					</span>
				</div>
				<div
					onClick={() => {
						if (!interactive) return;
						if (hapticFeedback.isSupported()) {
							hapticFeedback.impactOccurred("medium");
						}
						router.push("/packages/bg");
					}}
					className="relative col-span-1 row-span-1 flex cursor-pointer items-end  justify-center overflow-hidden rounded-3xl transition-transform active:scale-95 	"
				>
					<Image
						width={312}
						height={312}
						className="h-full w-full bg-neutral-300 object-cover"
						quality={50}
						placeholder="blur"
						blurDataURL="/img/countries/bg.png"
						src={"/img/countries/bg.png"}
						alt="news"
					/>
					<div className="absolute h-1/2 w-full bg-gradient-to-t from-black/50">
						{" "}
					</div>

					{interactive && (
						<>
							<div className=" absolute right-3 top-3 h-[18px] w-[18px] bg-white/75 blur-sm	 "></div>
							<div className=" absolute right-3 top-3">
								<MdArrowForwardIos className=" h-4 w-4 " />
							</div>
						</>
					)}

					<span className="absolute pb-2 text-xs font-medium uppercase text-white">
						BULGARIA
					</span>
				</div>
				<div
					onClick={() => {
						if (!interactive) return;
						if (hapticFeedback.isSupported()) {
							hapticFeedback.impactOccurred("medium");
						}
						router.push("/packages/pl");
					}}
					className="relative col-span-1 row-span-1 flex cursor-pointer items-end  justify-center overflow-hidden rounded-3xl transition-transform active:scale-95 	"
				>
					<Image
						width={312}
						height={312}
						className="h-full w-full bg-neutral-300 object-cover"
						quality={50}
						placeholder="blur"
						blurDataURL="/img/countries/pl.png"
						src={"/img/countries/pl.png"}
						alt="news"
					/>
					<div className="absolute h-1/2 w-full bg-gradient-to-t from-black/50">
						{" "}
					</div>

					{interactive && (
						<>
							<div className=" absolute right-3 top-3 h-[18px] w-[18px] bg-white/75 blur-sm	 "></div>
							<div className=" absolute right-3 top-3">
								<MdArrowForwardIos className=" h-4 w-4 " />
							</div>
						</>
					)}

					<span className="absolute pb-2 text-xs font-medium uppercase text-white">
						POLAND
					</span>
				</div>
				<div
					onClick={() => {
						if (!interactive) return;
						if (hapticFeedback.isSupported()) {
							hapticFeedback.impactOccurred("medium");
						}
						router.push("/packages/th");
					}}
					className="relative col-span-2 row-span-1 flex cursor-pointer items-end  justify-center overflow-hidden rounded-3xl transition-transform active:scale-95 	"
				>
					<Image
						width={312}
						height={312}
						className="h-full w-full bg-neutral-300 object-cover"
						quality={50}
						placeholder="blur"
						blurDataURL="/img/countries/th.png"
						src={"/img/countries/th.png"}
						alt="news"
					/>
					<div className="absolute h-1/2 w-full bg-gradient-to-t from-black/50">
						{" "}
					</div>

					{interactive && (
						<>
							<div className=" absolute right-3 top-3 h-[18px] w-[18px] bg-white/75 blur-sm	 "></div>
							<div className=" absolute right-3 top-3">
								<MdArrowForwardIos className=" h-4 w-4 " />
							</div>
						</>
					)}

					<span className="absolute pb-2 text-xs font-medium uppercase text-white">
						THAILAND
					</span>
				</div>
			</div>
		</div>
	);
};

export default PopularCountriesGrid;
