import "../globals.css";
import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import { Metadata, Viewport } from "next";
import { TelegramProvider } from "@/providers/telegram-provider";
import Script from "next/script";
import ReactQueryProvider from "@/providers/query-provider";
import TonConnectProvider from "@/providers/tonconnect-provider";
import { Toaster } from "@/components/ui/toaster";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";

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
        <ReactQueryProvider>
            <TelegramProvider>
                <TonConnectProvider>
                    <html lang="en" suppressHydrationWarning>
                        <body
                            className={cn(
                                "min-h-screen w-screen font-sans antialiased overflow-x-hidden bg-background no-select",
                                fontSans.variable
                            )}
                        >
                            <Script
                                src="https://telegram.org/js/telegram-web-app.js"
                                strategy="beforeInteractive"
                            />
                            {/* <Script
                                src="https://sad.adsgram.ai/js/sad.min.js"
                                strategy="beforeInteractive"
                            /> */}
                            <Script src="https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js" />
                            {children}
                            <Toaster />
                            <Analytics />
                        </body>
                        <GoogleAnalytics
                            gaId={process.env.NEXT_PUBLIC_MEASUREMENT_ID ?? ""}
                        />
                    </html>
                </TonConnectProvider>
            </TelegramProvider>
        </ReactQueryProvider>
    );
}
