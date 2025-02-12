"use client";

import { cn } from "@/lib/utils";
import EnvModeLabel from "./env-mode-label";

const Header = () => {
	return (
		<div
			className={cn(
				"container flex flex-col bg-background text-foreground transition-colors duration-300 sticky top-0 z-50"
			)}
		>
			<div className="top-header-block"></div>
			<div className="bottom-header-block flex gap-1 items-center justify-center">
				<span className=" text-xl font-bold">Esim4U </span>
				<EnvModeLabel />
			</div>
		</div>
	);
};

export default Header;
