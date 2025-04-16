"use client";

import { useEffect } from "react";
import {
	init,
	backButton,
	miniApp,
	themeParams,
	initData,
	viewport,
	closingBehavior,
	swipeBehavior,
} from "@telegram-apps/sdk-react";
import { useTelegramMock } from "@/hooks/use-telegram-mock";
import { locationManager } from "@telegram-apps/sdk";

type Props = {
	children: React.ReactNode;
};

const TelegramProvider = ({ children }: Props) => {
	if (true) {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		useTelegramMock();
	}

	useEffect(() => {
		async function configTMA() {
			init();

			if (backButton.isSupported()) {
				backButton.mount();
			}
			miniApp.mount();
			themeParams.mount();
			initData.restore();

			void viewport
				.mount()
				.then(() => {
					if (viewport.requestFullscreen.isAvailable()) {
						viewport.requestFullscreen();
					}
					// Define components-related CSS variables.
					viewport.bindCssVars();
					miniApp.bindCssVars();
					themeParams.bindCssVars();
				})
				.catch((e) => {
					console.error(
						"Something went wrong mounting the viewport",
						e
					);
				})
				.finally(() => {
					if (!viewport.isCssVarsBound()) {
						viewport.bindCssVars();
					}

					if (!miniApp.isCssVarsBound()) {
						miniApp.bindCssVars();
					}

					if (!themeParams.isCssVarsBound()) {
						themeParams.bindCssVars();
					}
				});

			if (closingBehavior.mount.isAvailable()) {
				closingBehavior.mount();
				if (closingBehavior.isMounted()) {
					closingBehavior.enableConfirmation();
				}
			}

			if (swipeBehavior.mount.isAvailable()) {
				swipeBehavior.mount();
				if (swipeBehavior.isMounted()) {
					swipeBehavior.disableVertical();
				}
			}

			if (locationManager.mount.isAvailable()) {
				try {
					const promise = locationManager.mount();
					locationManager.isMounting(); // true
					await promise;
					locationManager.isMounting(); // false
					locationManager.isMounted(); // true
				} catch (err) {
					locationManager.mountError(); // equals "err"
					locationManager.isMounting(); // false
					locationManager.isMounted(); // false
				}
			}

			// Initial configuration
			miniApp.setBackgroundColor("#F0F0F4");
			miniApp.setHeaderColor("#F0F0F4");
			viewport.expand();
		}

		configTMA();
	}, []);

	return children;
};

export default TelegramProvider;
