import { toast } from "@/components/ui/use-toast";
import { useTelegram } from "@/providers/telegram-provider";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const hapticFeedback = (type = "medium") => {
    const webApp = (window as any).Telegram?.WebApp;

    if (["light", "medium", "heavy"].includes(type)) {
        webApp?.HapticFeedback?.impactOccurred(type);
    }

    if (["success", "error", "warning"].includes(type)) {
        webApp?.HapticFeedback?.notificationOccurred(type);
    }
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

export function copyText(text: string | number, e?: any) {
    e?.stopPropagation();

    if (!text) {
        toast({
            variant: "destructive",
            title: "Error",
        });
        return;
    }

    try {
        navigator.clipboard.writeText(text.toString());
        toast({
            variant: "esim4u",
            title: "Copied!",
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error: Please try again",
        });
    }
}

export const getReferralLink = (user_id: string | number) => {
    if (!user_id) {
        return "";
    }
    return `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}?start=${user_id}`;
};

export const detectIOSVersion = () => {
    const userAgent = window.navigator.userAgent;
    const iOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
    if (iOS) {
        const version = userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
        if (!version) return 0;
        return parseFloat(`${version[1]}.${version[2]}${+version[3] | 0}`);
    }
    return 0;
};

export const generateEsimActivationLink = (
    sm_dp: string,
    confiramtion_code: string
) => {
    return `LPA:1$${sm_dp}$${confiramtion_code}`;
};
