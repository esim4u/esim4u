import "../globals.css";

import { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";

import { cn } from "@/lib/utils";

import { Toaster } from "@/components/ui/toaster";
import MainProvider from "@/providers/providers";

const fontSans = FontSans({
    subsets: ["latin"],
    variable: "--font-sans",
});

export const metadata: Metadata = {
    title: "Esim4u",
    description: "Telegram MiniApp for buying eSIMs",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
    userScalable: false,
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={cn(
                    "no-select no-scrollbar h-screen w-screen overflow-x-hidden bg-background font-sans antialiased",
                    fontSans.variable,
                )}
            >
                <MainProvider>
                    <Script src="https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js" />
                    <div className={cn("no-scrollbar contentSafeArea")}>
                        <div style={{ height: "calc(100% + 1px)" }}>
                            {children}
                        </div>
                    </div>
                    <Toaster />
                    <Analytics />
                </MainProvider>
            </body>
        </html>
    );
}
