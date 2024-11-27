"use client";
import { useSignal, initData, backButton } from "@telegram-apps/sdk-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const InitDataPage = () => {
	const router = useRouter();

	const initDataRaw = useSignal(initData.raw);
	const initDataState = useSignal(initData.state);

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
				{JSON.stringify(initDataState, null, 2)}
			</pre>
			<br />
			<pre className="max-w-[420px] overflow-x-hidden break-all text-wrap">
				{JSON.stringify(initDataRaw, null, 2)}
			</pre>
		</main>
	);
};

export default InitDataPage;
