"use client";
import { useSignal, initData, useLaunchParams } from "@telegram-apps/sdk-react";
import { useEffect } from "react";

type Props = {
	children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
	const initDataRaw = useSignal(initData.raw);
	const initDataState = useSignal(initData.state);
	const lp = useLaunchParams();

	useEffect(() => {
		if (!initDataRaw) return;
		if (!initDataState) return;
		if (!lp) return;
		const parent_id =
			parseInt(initDataState?.startParam || "") || undefined;

		const platform = lp?.platform || "";

		console.log("parent_id", parent_id);
		console.log("platform", platform);

	}, [initDataRaw, initDataState, lp]);

	return children;
};

export default AuthProvider;
