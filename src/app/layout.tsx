import "./globals.css";
import { Inter as FontSans } from "next/font/google";

import { cn } from "@/lib/utils";
import { Metadata, Viewport } from "next";
import { TelegramProvider } from "@/providers/telegram-provider";
import Script from "next/script";
import ReactQueryProvider from "@/providers/query-provider";
import TonConnectProvider from "@/providers/tonconnect-provider";
import { Toaster } from "@/components/ui/toaster";
import { GoogleAnalytics } from "@next/third-parties/google";

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
                        <Script
                            strategy="lazyOnload"
                            src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_MEASUREMENT_ID}`}
                        />

                        <Script id="" strategy="lazyOnload">
                            {`
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${process.env.NEXT_PUBLIC_MEASUREMENT_ID}', {
                                page_path: window.location.pathname,
                                });
                            `}
                        </Script>

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
                            <Script src="https://gateway.sumup.com/gateway/ecom/card/v2/sdk.js" />
                            {children}
                            <Toaster />
                        </body>
                        {/* <GoogleAnalytics gaId="G-2KEFLLBLR1" /> */}
                    </html>
                </TonConnectProvider>
            </TelegramProvider>
        </ReactQueryProvider>
    );
}
