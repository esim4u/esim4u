import { useTelegram } from "@/providers/telegram-provider";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const hapticFeedback = (webApp: any) => {
    webApp?.HapticFeedback?.impactOccurred("medium");
};

export const highlightText = (query: string, text: string) => {
    if (!query.trim()) {
        return text;
    }
    const searchLowerCase = query.trim().toLowerCase();
    const regex = new RegExp(`(${searchLowerCase})`, "gi");
    return text.replace(
        regex,
        '<span style="color: #009dff; font-weight: 700">$1</span>'
    );
};

export const floor = (number: number, degree = 2) => {
    return Math.floor(number * 10 ** degree) / 10 ** degree;
};
export const ceil = (number: number, degree = 2) => {
    return Math.ceil(number * 10 ** degree) / 10 ** degree;
};
