import { l } from "@/features/locale/lib/locale";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { PiCopyBold } from "react-icons/pi";
import { clientEnvs } from "@/env/client";
import { sonner } from "@/components/ui/sonner";

const TELEGRAM_BOT_USERNAME = clientEnvs.NEXT_PUBLIC_BOT_USERNAME;

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
		sonner.info(
			<span className="flex flex-row items-center gap-2 font-semibold">
				<PiCopyBold className="h-[18px] w-[18px]" />
				<p>{l("toast_referral_copied")}</p>
			</span>
		);
	} catch (error) {
		sonner.error("Error");
	}
}

export function copyText(text: string | number, e?: any) {
	e?.stopPropagation();

	if (!text) {
		sonner.error("Error");

		return;
	}

	try {
		navigator.clipboard.writeText(text.toString());
		sonner.info(
			<span className="flex flex-row items-center gap-2 font-semibold">
				<PiCopyBold className="h-[18px] w-[18px]" />
				<p>{l("toast_copied")}</p>
			</span>
		);
	} catch (error) {
		sonner.error("Error");
	}
}

export const getReferralLink = (user_id: string | number) => {
	if (!user_id) {
		return "";
	}
	return `https://t.me/${TELEGRAM_BOT_USERNAME}/app?startapp=${user_id}`;
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

export const highlightMatches = (search: string, text: string) => {
	if (search.trim() === "") {
		return text;
	}
	const regex = new RegExp(`(${search})`, "gi");
	return text.split(regex).map((part, index) => {
		return regex.test(part) ? (
			<span key={index} className="highlight text-tgaccent">
				{part}
			</span>
		) : (
			part
		);
	});
};
