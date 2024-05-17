import { toast } from "@/components/ui/use-toast";
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


export function copyText(
    text: string | number,
    e?: any
) {
    e?.stopPropagation();

    if(!text){
        toast({
            variant: "destructive",
            title: "Error",
        });
        return;
    }

    navigator.clipboard.writeText(text.toString());
    toast({
        variant: "esim4u",
        title: "Copied!",
    });
}


export const getReferralLink = (user_id: string | number) => {
    if(!user_id){
        return "";
    }
    return `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}/app?startapp=${user_id}`;
}