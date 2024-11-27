"use client";
import React from "react";
import { Button } from "../ui/button";
import { initData, shareURL } from "@telegram-apps/sdk-react";
import { toast } from "sonner";

const ShareButton = () => {
	return (
		<Button
			onClick={() => {
				if (!shareURL.isAvailable()) {
					toast.error("Share is not available at the moment");
					return;
				}
				shareURL(
					"https://t.me/tma_casino_bot/app?startapp=" +
						initData.user()?.id,
					"Check out this cool app!"
				);
			}}
		>
			Share app with Friends
		</Button>
	);
};

export default ShareButton;
