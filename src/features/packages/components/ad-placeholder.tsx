"use client";

import { Button } from "@/components/ui/button";
import { openTelegramLink } from "@telegram-apps/sdk-react";
import React from "react";

const AdPlaceholder = () => {
	return (
		<div className=" w-full">
			<div className="relative flex h-[180px] w-full flex-col items-center justify-center gap-2 rounded-3xl bg-white">
				<div className="mt-1 flex flex-col items-center justify-center">
					<h2 className="items-center font-medium uppercase text-neutral-500">
						your ad could be here
					</h2>
					<Button
						variant={"unstyled"}
						size={"fit"}
						onClick={() => {
							openTelegramLink("https://t.me/esim4u_support_bot");
						}}
					>
						<span className="font-medium text-tgaccent underline underline-offset-2">
							contact us
						</span>
					</Button>
				</div>
			</div>
		</div>
	);
};

export default AdPlaceholder;
