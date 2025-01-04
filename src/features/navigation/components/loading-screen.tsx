"use client";

import React from "react";
import amongUsAnim from "@/assets/anim/among-us.json";
const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";

const LoadingScreen = ({ className }: { className?: string }) => {
	return (
		<main
			className={cn(
				"container h-full grow flex items-center justify-center",
				className
			)}
		>
			<div className={"w-56 h-56"}>
				<Suspense fallback={<div></div>}>
					<Lottie className="-mt-14" animationData={amongUsAnim} />
				</Suspense>
			</div>
		</main>
	);
};

export default LoadingScreen;
