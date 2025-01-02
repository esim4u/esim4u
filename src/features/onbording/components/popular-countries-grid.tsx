import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MdArrowForwardIos } from "react-icons/md";

import { l } from "@/features/locale/lib/locale";

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

			<div className="grid max-h-48 grid-cols-4 grid-rows-2 gap-2">
				<div
					onClick={() => {
						if (!interactive) return;

						router.push("/esims/eg");
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

						router.push("/esims/ch");
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

						router.push("/esims/es");
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

						router.push("/esims/it");
					}}
					className=" relative col-span-2 row-span-1 flex cursor-pointer items-end  justify-center overflow-hidden rounded-3xl transition-transform active:scale-95 	"
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
			</div>
		</div>
	);
};

export default PopularCountriesGrid;
