"use client";

import { useSignal, viewport } from "@telegram-apps/sdk-react";
import { useTheme } from "next-themes";
import { useMemo } from "react";
import { Toaster as SonnerToaster } from "sonner";
import { toast as sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof SonnerToaster>;

const Sonner = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();
	const contentSafeAreaInsets = useSignal(viewport.contentSafeAreaInsets);
	const safeAreaInsets = useSignal(viewport.safeAreaInsets);

	const offset = useMemo(() => {
		const bottomOffset =
			(contentSafeAreaInsets.bottom || 0) +
			(safeAreaInsets.bottom || 0) +
			+ 48;
		return bottomOffset;
	}, [contentSafeAreaInsets, safeAreaInsets]);

	return (
		<SonnerToaster
			theme={theme as ToasterProps["theme"]}
			toastOptions={{
				classNames: {
					toast: " border-none bg-gradient-to-br shadow-md rounded-2xl pointer-events-auto p-5",

					default: " from-punsh-400 to-punsh-600 text-white",
					info: "from-blue-400 to-blue-600 text-white",
					warning: "from-yellow-400 to-yellow-600 text-white",
					error: "from-red-400 to-red-600 text-white",
					success: "!from-emerald-400 !to-emerald-600 text-white",

					closeButton:
						"!bg-transparent border-none text-white top-3 left-[calc(100%-18px)]",
					actionButton: "bg-primary text-primary-foreground",
					cancelButton: "bg-muted text-muted-foreground",
				},
			}}
      position={"bottom-right"}
      offset={offset}
      duration={2000}
			{...props}
		/>
	);
};

export { Sonner, sonner };
