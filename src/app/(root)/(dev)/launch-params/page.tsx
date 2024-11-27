"use client";
import { backButton, useLaunchParams } from "@telegram-apps/sdk-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LaunchParamsPage = () => {
	const router = useRouter();
	const lp = useLaunchParams();

	useEffect(() => {
		if (backButton.isSupported()) {
			backButton.show();
			return backButton.onClick(() => {
				router.back();
			});
		}
	}, [router]);

	return (
		<main className="container py-5 bg-white min-h-screen">
			<pre className="max-w-[420px] overflow-x-hidden break-all text-wrap">
				{JSON.stringify(lp, null, 2)}
			</pre>
		</main>
	);
};

export default LaunchParamsPage;
