"use client";
import React from "react";
import { Button } from "../ui/button";
import { initData, shareURL } from "@telegram-apps/sdk-react";
import { IoShareSocialOutline } from "react-icons/io5";

const TELEGRAM_BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
const ShareButton = () => {
	return (
		<Button
			onClick={() => {
				if (!shareURL.isAvailable()) {
					return;
				}
				shareURL(
					`https://t.me/${TELEGRAM_BOT_USERNAME}/app?startapp=` +
						initData.user()?.id,
					"Check out this cool app!"
				);
			}}
			size={"icon"}
			className="bg-white hover:bg-white/90 active:bg-white/90 text-neutral-700 rounded-full h-10 w-10 py-0 gap-1 transition-all active:scale-95"
		>
			<IoShareSocialOutline className="!size-5" />
		</Button>
	);
};

export default ShareButton;
