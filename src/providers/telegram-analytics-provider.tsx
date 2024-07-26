"use client";

import { TwaAnalyticsProvider } from '@tonsolutions/telemetree-react';

const APP_NAME = process.env.NEXT_PUBLIC_TELEMETREE_APP_NAME || '';
const API_KEY = process.env.NEXT_PUBLIC_TELEMETREE_API_KEY || '';
const PROJECT_ID = process.env.NEXT_PUBLIC_TELEMETREE_PROJECT_ID || '';

const TelegramAnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
    return (
        <TwaAnalyticsProvider
            projectId={PROJECT_ID}
            apiKey={API_KEY}
            appName={APP_NAME}
        >
            {children}
        </TwaAnalyticsProvider>
    );
};

export default TelegramAnalyticsProvider;
