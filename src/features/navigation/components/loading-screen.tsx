"use client";

import React from "react";
import amongUsAnim from "@/assets/anim/among-us.json";
import Lottie from "lottie-react";
import { Suspense } from "react";

const LoadingScreen = () => {
	return (
		<main className="container flex items-center justify-center py-5 bg-background h-screen">
			<div className={"w-56 h-56"}>
				<Suspense fallback={<div></div>}>
					<Lottie className="-mt-14" animationData={amongUsAnim} />
				</Suspense>
			</div>
		</main>
	);
};

export default LoadingScreen;
