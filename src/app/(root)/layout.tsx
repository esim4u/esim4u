import type { Metadata } from "next";
import "../globals.css";

import { cn } from "@/lib/utils";
import MainProvider from "@/providers";
import localFont from "next/font/local";
import { Toaster } from "@/components/ui/toaster";

const sfProRounded = localFont({
	src: [
		{
			path: "../../assets/fonts/sf-pro-rounded/SF-Pro-Rounded-Ultralight.ttf",
			weight: "100",
		},
		{
			path: "../../assets/fonts/sf-pro-rounded/SF-Pro-Rounded-Thin.ttf",
			weight: "200",
		},
		{
			path: "../../assets/fonts/sf-pro-rounded/SF-Pro-Rounded-Light.ttf",
			weight: "300",
		},
		{
			path: "../../assets/fonts/sf-pro-rounded/SF-Pro-Rounded-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "../../assets/fonts/sf-pro-rounded/SF-Pro-Rounded-Medium.ttf",
			weight: "500",
		},
		{
			path: "../../assets/fonts/sf-pro-rounded/SF-Pro-Rounded-Semibold.ttf",
			weight: "600",
		},
		{
			path: "../../assets/fonts/sf-pro-rounded/SF-Pro-Rounded-Bold.ttf",
			weight: "700",
		},
		{
			path: "../../assets/fonts/sf-pro-rounded/SF-Pro-Rounded-Heavy.ttf",
			weight: "800",
		},
		{
			path: "../../assets/fonts/sf-pro-rounded/SF-Pro-Rounded-Black.ttf",
			weight: "900",
		},
	],
});

export const metadata: Metadata = {
	title: "TMA app",
	description: "TMA app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={cn(
					"antialiased no-scrollbar h-svh bg-background",
					sfProRounded.className
				)}
			>
				<MainProvider>
					<div className="flex flex-col min-h-svh">{children}</div>
					<Toaster />
				</MainProvider>
			</body>
		</html>
	);
}
