"use client";

import SubscribeBanner from "@/features/home/components/subscribe-banner";
import LoadingScreen from "@/features/navigation/components/loading-screen";
import Lottie from "lottie-react";
import confettiAnim from "@/assets/anim/confetti.json";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useGetOrderById } from "@/features/payment/hooks/use-payment";
import { useTgBackButton } from "@/hooks/use-telegram";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
	const router = useRouter();
	const lottieRef = useRef<any>();
	const searchParams = useSearchParams();
	const order_id = searchParams.get("order_id");

	const redirectPath = `/profile?order_id=${order_id}&is_payment=true`;

	useTgBackButton({
		customFullPath: redirectPath,
	});

	const { data: order, isPending } = useGetOrderById(order_id);

	useEffect(() => {
		setTimeout(() => {
			router.push(redirectPath);
		}, 15 * 1000); // 15s
	}, []);

	if (isPending) return <LoadingScreen />;
	return (
		<main className="container flex flex-col justify-between items-stretch grow bg-background gap-2">
			<div className="z-0 flex h-full grow flex-col items-center justify-center gap-28">
				<div className="flex flex-col items-center justify-center gap-4">
					<div className="flex flex-col  gap-1 text-center">
						<h2 className="text-5xl font-bold ">Thank u Fren</h2>
						<p className="font-medium">
							Your {order?.coverage} eSim is waiting for you{" "}
							<br />
							Enjoy your trip!
						</p>
					</div>
					<div className=" w-32">
						<div className=" animate-appear drop-shadow-lg">
							<Image
								className="esim-mask bg-neutral-300"
								src={order?.image_url || ""}
								width={128}
								height={128}
								alt="country"
							/>
						</div>
					</div>
					<Button
						onClick={() => {
							router.push(redirectPath);
						}}
						className="text-xl"
						variant={"link"}
					>
						Go to esim
					</Button>
				</div>
			</div>
			<div className="z-20 my-4 flex h-fit flex-col items-center justify-center gap-4">
				<SubscribeBanner className={"mx-4"} />
			</div>
			<div className="absolute z-10 max-h-dvh w-dvw max-w-96 overflow-hidden">
				<Lottie
					lottieRef={lottieRef}
					animationData={confettiAnim}
					loop={false}
					className="-mt-12"
				/>
			</div>
		</main>
	);
}
