import React from "react";

import { Button } from "../ui/button";
import { QrIcon } from "../icons";
import { initData } from "@telegram-apps/sdk-react";
import Qr from "../ui/qr";
import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "../ui/drawer";
import { cn } from "@/lib/utils";

const TELEGRAM_BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;

const QrRefDrawer = ({ className }: { className?: string }) => {
	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button
					size={"icon"}
					className={cn(
						" bg-white hover:bg-white/90 active:bg-white/90 rounded-full h-10 w-10 py-0 gap-1 transition-all active:scale-95"
					)}
				>
					<QrIcon className="size-4" />
				</Button>
			</DrawerTrigger>
			<DrawerContent className="min-h-[70dvh] container">
				<div className="mx-auto w-full max-w-sm">
					<DrawerHeader>
						<DrawerTitle className="text-center">
							{"QR Code"}
						</DrawerTitle>
						<DrawerDescription>
							{"Show this QR code to your friends to get rewards"}
						</DrawerDescription>
					</DrawerHeader>
					<DrawerBody className="flex justify-center w-full items-center">
						<Qr
							className="mt-4"
							url={
								`https://t.me/${TELEGRAM_BOT_USERNAME}/app?startapp=` +
								initData.user()?.id
							}
						/>
					</DrawerBody>
				</div>
			</DrawerContent>
		</Drawer>
	);
};

export default QrRefDrawer;
