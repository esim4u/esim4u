import type { Metadata } from "next";
import "../globals.css";

import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import MainProvider from "@/providers";
import { Toaster } from "@/components/ui/sonner";

const fontSans = FontSans({
	subsets: ["latin"],
	variable: "--font-sans",
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
			<body className={cn(`antialiased bg-slate-100`, fontSans.variable)}>
				<MainProvider>
					{children}
					<Toaster />
				</MainProvider>
			</body>
		</html>
	);
}
