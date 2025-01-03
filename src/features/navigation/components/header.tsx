"use client";

import { cn } from "@/lib/utils";

const Header = () => {
	return (
		<div
			className={cn(
				"container flex flex-col bg-background text-foreground transition-colors duration-300 sticky top-0 z-20"
			)}
		>
			<div className="top-header-block"></div>
			<div className="bottom-header-block flex items-center justify-center">
				<span className=" text-xl font-bold">Esim4U </span>
			</div>
		</div>
	);
};

export default Header;
