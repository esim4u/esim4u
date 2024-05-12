import { useTelegram } from "@/providers/telegram-provider";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const hapticFeedback = (webApp: any) => {
    webApp?.HapticFeedback?.impactOccurred("medium");
};
