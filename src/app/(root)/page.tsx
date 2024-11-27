"use client";

import ShareButton from "@/components/shared/share-button";
import { Button } from "@/components/ui/button";
import { backButton } from "@telegram-apps/sdk-react";
import Link from "next/link";
import { useEffect } from "react";

export default function Home() {
	useEffect(() => {
		if (backButton.isSupported()) {
			backButton.hide();
		}
	}, []);

	return (
		<main className="container py-5 bg-white min-h-screen w-full">
			<div className="flex flex-col w-full gap-3">
				<Button asChild>
					<Link href="/launch-params" aria-label="Launch params">
						Launch params
					</Link>
				</Button>
				<Button asChild>
					<Link href="/init-data" aria-label="User init data">
						User init data
					</Link>
				</Button>
				<Button asChild>
					<Link href="/theme-params" aria-label="Theme params">
						Theme params
					</Link>
				</Button>

				<Button asChild>
					<Link href="/session-storage" aria-label="Session Storage">
						Session Storage
					</Link>
				</Button>

				<ShareButton />
			</div>
		</main>
	);
}
