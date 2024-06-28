import "../globals.css";

import { Metadata, Viewport } from "next";
import { Inter as FontSans } from "next/font/google";
import Script from "next/script";
import ReactQueryProvider from "@/providers/query-provider";
import { TelegramProvider } from "@/providers/telegram-provider";
import TonConnectProvider from "@/providers/tonconnect-provider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Analytics } from "@vercel/analytics/react";

import { cn } from "@/lib/utils";

import { Toaster } from "@/components/ui/toaster";

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
                                "no-select no-scrollbar h-screen w-screen overflow-hidden bg-background font-sans antialiased",
                                fontSans.variable,
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
                            <div className="no-scrollbar absolute bottom-0 left-0 right-0 top-0 overflow-y-auto overflow-x-hidden ">
                                <div style={{height: "calc(100% + 1px)"}}>{children}</div>
                            </div>
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
