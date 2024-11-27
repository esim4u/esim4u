"use client";
import Loader from "@/components/ui/loader";
import { useAuth } from "@/hooks/use-auth";
import { TelegramUser } from "@/types/auth.types";
import { useSignal, initData, useLaunchParams } from "@telegram-apps/sdk-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type Props = {
	children: React.ReactNode;
};

const AuthProvider = ({ children }: Props) => {
	const router = useRouter();
	const initDataRaw = useSignal(initData.raw);
	const initDataState = useSignal(initData.state);
	const lp = useLaunchParams();
	const auth = useAuth();

	useEffect(() => {
		if (!initDataRaw) return;
		if (!initDataState) return;
		if (!lp) return;

		if (initDataState.user && lp) {
			const tgUser: TelegramUser = {
				...initDataState.user,
				startParam: initDataState.startParam,
				platform: lp?.platform,
			};
			auth.mutate(tgUser);
		}
	}, [initDataRaw, initDataState, lp, router]);

	if (!initDataRaw || !initDataState || !lp)
		return (
			<main className="container flex h-screen items-center justify-center bg-white py-5">
				<Loader />
			</main>
		);

	return children;
};

export default AuthProvider;
