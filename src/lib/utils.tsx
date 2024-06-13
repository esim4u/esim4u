import { useTelegram } from "@/providers/telegram-provider";
import { clsx, type ClassValue } from "clsx";
import { MdOutlineContentCopy } from "react-icons/md";
import { PiCopyBold } from "react-icons/pi";
import { twMerge } from "tailwind-merge";

import { ButtonProps } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

import { l } from "./locale";

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
        '<span style="color: #009dff; font-weight: 700">$1</span>',
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
            description: (
                <span className="flex flex-row items-center gap-2 font-semibold">
                    <PiCopyBold className="w-[18px] h-[18px]" />
                    <p>{l("toast_copied")}</p>
                </span>
            ),
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error: Please try again",
        });
    }
}
export function copyReferralLinkToClipBoard(user_id: string | number, e?: any) {
    e?.stopPropagation();

    const link = getReferralLink(user_id);

    try {
        navigator.clipboard.writeText(link.toString());
        toast({
            variant: "esim4u",
            description: (
                <span className="flex flex-row items-center gap-2 font-semibold">
                    <PiCopyBold className="w-[18px] h-[18px]" />
                    <p>{l("toast_referral_copied")}</p>
                </span>
            ),
        });
    } catch (error) {
        toast({
            variant: "destructive",
            title: "Error: Please try again",
        });
    }
}

// export const shareRef = async (text: string) => {
//     const shareData = {
//         title: "Vignette ID",
//         text: "Share this order to pay!",
//         url: "awdwad",
//     };

//     try {
//         navigator.share(shareData);
//     } catch (error) {
//         console.error("Error sharing", error);
//     }
// };

export const getReferralLink = (user_id: string | number) => {
    if (!user_id) {
        return "";
    }
    return `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}/app?startapp=${user_id}`;
    //return `https://t.me/share/url?url=https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}/app?startapp=${user_id}&text=Purchase esims here!`;
};

export const shareRef = (user_id: string) => {
    return `https://t.me/share/url?url=https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}/app?startapp=${user_id}&text=Purchase esims here!`;
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
    confiramtion_code: string,
) => {
    return `LPA:1$${sm_dp}$${confiramtion_code}`;
};

export const scrollToTop = () => {
    window.scrollTo(0, 0);
};

export const loseFocus = () => {
    const inputs = document.querySelectorAll("input, textarea, select, button");
    inputs.forEach((input: any) => input.blur());
};
