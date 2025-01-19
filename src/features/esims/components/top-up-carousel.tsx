import {
	Carousel,
	CarouselApi,
	CarouselContent,
	CarouselItem,
} from "@/components/ui/carousel";
import Dot from "@/components/ui/dot";
import { useGetTonUsdRate } from "@/features/currency/hooks/use-currency";
import { l } from "@/features/locale/lib/locale";
import { useTgUser } from "@/hooks/use-telegram";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useCreateTopupOrder } from "../hooks/use-orders";

const TopUpCarousel = ({
	topUps,
	iccid,
	image_url,
	coverage,
}: {
	topUps: any[];
	iccid: string;
	image_url: string;
	coverage: string;
}) => {
	const { tgUser } = useTgUser();
	const router = useRouter();

	const [selectedPackage, setSelectedPackage] = useState<any>(topUps[0]);

	const { data: rateTonUsd } = useGetTonUsdRate();
	const priceInTon = useMemo(() => {
		if (!rateTonUsd) return 999;

		const priceInTon = selectedPackage?.total_price / rateTonUsd;
		return +priceInTon.toFixed(3);
	}, [rateTonUsd, selectedPackage]);

	const createTopup = useCreateTopupOrder();

	const [api, setApi] = useState<CarouselApi>();
	useEffect(() => {
		if (!api) {
			return;
		}

		api.on("select", () => {
			console.log("selected", api.selectedScrollSnap());
		});
	}, [api]);

	if (!topUps || topUps.length == 0) return null;

	return (
		<div className={cn("flex flex-col gap-1 pt-2", "-mx-2")}>
			<h2
				className={cn(
					"pl-2 text-sm font-semibold uppercase text-white",
					"px-7"
				)}
			>
				{l("title_topup")}
			</h2>
			<Carousel setApi={setApi}>
				<CarouselContent className={cn("ml-1", "mr-4 pl-4")}>
					{topUps &&
						topUps.map((plan: any, index: number) => {
							return (
								<CarouselItem
									key={index}
									className="basis-[182px] cursor-pointer pl-1"
								>
									<div
										onClick={() => {
											setSelectedPackage(plan);
											api?.scrollTo(index);
										}}
										className={cn(
											"relative  z-20 flex h-11 w-[172px] flex-row items-center  justify-center gap-2 rounded-xl  bg-white p-2 transition-all active:border-2 active:border-emerald-300 ",
											selectedPackage.id == plan.id &&
												"border-2 border-emerald-300"
										)}
									>
										<div className="flex flex-col">
											<h2 className=" text-sm font-bold leading-4">
												{plan.amount / 1024}
												<span>GB</span>
											</h2>
											<p className=" text-xs font-medium leading-3  text-neutral-500">
												{plan.day} {l("text_days")}
											</p>
										</div>
										<Dot className="size-1.5" />
										<div>
											<h2 className=" text-xl font-bold">
												${plan.total_price}
											</h2>
										</div>
									</div>
									{selectedPackage.id == plan.id && (
										<div
											onClick={async () => {
												if (!tgUser || !tgUser.id) {
													return;
												}
												createTopup
													.mutateAsync({
														iccid: iccid,
														net_price:
															selectedPackage.net_price,
														original_price:
															selectedPackage.price,
														total_price:
															selectedPackage.total_price,
														total_price_eur:
															selectedPackage.total_price_eur,
														total_price_ton:
															priceInTon,
														telegram_id: tgUser?.id,
														package_id:
															selectedPackage.id,
														image_url: image_url,
														coverage: coverage,
														validity:
															selectedPackage.day,
														data: selectedPackage.data,
													})
													.then((data) => {
														router.push(
															`/payment/${data.order_id}`
														);
													});
											}}
											className="relative -mt-2 ml-2 mr-4 rounded-b-xl bg-emerald-300 pb-1.5 pt-3 hover:bg-emerald-300 active:scale-95"
										>
											<h2 className="text-center text-xs font-bold text-white">
												{l("btn_pay")}
											</h2>
										</div>
									)}
								</CarouselItem>
							);
						})}
				</CarouselContent>
			</Carousel>
		</div>
	);
};

export default TopUpCarousel;
