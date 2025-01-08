"use client";

import { GearIcon, WalletIcon } from "@/components/icons";
import QrRefDrawer from "@/components/shared/qr-ref-drawer";
import RefLinkButton from "@/components/shared/ref-link-button";
import ShareButton from "@/components/shared/share-button";
import { Button } from "@/components/ui/button";
import OneTimeInstallationWarningBanner from "@/features/esims/components/one-time-installation-warning-banner";
import UserEsims from "@/features/esims/components/user-esims";
import UserBlock from "@/features/users/components/user-block";
import { useTgBackButton } from "@/hooks/use-telegram";
import { useRouter } from "next/navigation";
import React from "react";

const ProfilePage = () => {
	const router = useRouter();
	useTgBackButton({
		customPath: "/home",
	});

	return (
		<main className="container flex flex-col gap-3 bg-background">
			<div className="relative flex flex-col items-center justify-center gap-4">
				<Button
					variant={"unstyled"}
					size={"fit"}
					onClick={() => {
						router.push("/settings");
					}}
					className="absolute left-0 top-12 h-12 w-12 "
				>
					<GearIcon className="h-12 w-12 text-neutral-500" />
				</Button>
				<UserBlock orientation="vertical" size="md" arrowIcon={false} />
				{/* <Button
					variant={"unstyled"}
					size={"fit"}
					onClick={() => {
						router.push("/wallet");
					}}
					className="absolute right-0 top-12 h-12 w-12 "
				>
					<WalletIcon className="h-12 w-12 text-tgaccent" />
				</Button> */}
			</div>
			<div className="flex items-center justify-center gap-2">
				<RefLinkButton />
				<QrRefDrawer />
				<ShareButton />
			</div>
			<OneTimeInstallationWarningBanner />
			<UserEsims />
		</main>
	);
};

export default ProfilePage;
