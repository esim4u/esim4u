import { l } from "@/features/locale/lib/locale";
import { toast } from "@/hooks/use-toast";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PiCopyBold } from "react-icons/pi";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const floor = (number: number, degree = 2) => {
	return Math.floor(number * 10 ** degree) / 10 ** degree;
};
export const ceil = (number: number, degree = 2) => {
	return Math.ceil(number * 10 ** degree) / 10 ** degree;
};

export function copyReferralLinkToClipBoard(user_id: string | number, e?: any) {
	e?.stopPropagation();

	const link = getReferralLink(user_id);

	try {
		navigator.clipboard.writeText(link.toString());
		toast({
			variant: "esim4u",
			description: (
				<span className="flex flex-row items-center gap-2 font-semibold">
					<PiCopyBold className="h-[18px] w-[18px]" />
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

export const getReferralLink = (user_id: string | number) => {
	if (!user_id) {
		return "";
	}
	return `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}/app?startapp=${user_id}`;
};

export const setQueryParamsWithFullPath = (
	path: string,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	searchQuery: any,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	params: any
) => {
	const urlSearchParams = new URLSearchParams(searchQuery);
	for (const key in params) {
		if (params[key]) {
			urlSearchParams.set(key, params[key]);
		} else {
			urlSearchParams.delete(key);
		}
	}
	let queryString = `${path}?${urlSearchParams.toString()}`;
	queryString = queryString.replace(/%2C/g, ",");

	return queryString || " ";
};
