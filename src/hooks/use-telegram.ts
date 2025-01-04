import { useEffect, useMemo, useState } from "react";
import {
	backButton,
	hapticFeedback,
	ImpactHapticFeedbackStyle,
	initData,
	useLaunchParams,
	useSignal,
} from "@telegram-apps/sdk-react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { setQueryParamsWithFullPath } from "@/lib/utils";

interface UseBackButtonProps {
	isVisible?: boolean;
	onBack?: (router: AppRouterInstance) => void;
	customPath?: string;
	customSearchParams?: string;
	customParams?: Record<string, string>;
	haptic?: ImpactHapticFeedbackStyle;
}

export const useTgBackButton = ({
	isVisible = true,
	onBack = undefined,
	customPath = undefined,
	customSearchParams = undefined,
	customParams = {},
	haptic = "medium",
}: UseBackButtonProps = {}) => {
	const router = useRouter();
	const [canGoBack, setCanGoBack] = useState(false);

	useEffect(() => {
		// Check if the browser history has a previous entry
		setCanGoBack(window.history.length > 1);

		if (!backButton.isSupported()) return;

		if (isVisible) {
			backButton.show();

			const handleBack = () => {
				if (
					hapticFeedback.isSupported() &&
					hapticFeedback.impactOccurred.isAvailable()
				) {
					hapticFeedback.impactOccurred(haptic);
				}

				if (onBack) {
					onBack(router);
				} else if (customPath) {
					const fullPath = setQueryParamsWithFullPath(
						customPath,
						customSearchParams,
						customParams
					);
					router.push(fullPath);
				} else {
					router.back();
				}
			};

			return backButton.onClick(handleBack);
		} else {
			backButton.hide();
		}
	}, [
		router,
		isVisible,
		onBack,
		customPath,
		customParams,
		customSearchParams,
		haptic,
		canGoBack,
	]);
};

export const useTgUser = () => {
	const initDataState = useSignal(initData.state);
	const lp = useLaunchParams();

	const tgUser = useMemo(() => {
		if (!initDataState || !lp) {
			return null;
		}
		return {
			...initDataState.user,
			startParam: initData.startParam,
			platform: lp?.platform,
		};
	}, [initDataState, lp]);

	return {
		tgUser,
	};
};
