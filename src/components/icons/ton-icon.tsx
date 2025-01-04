import React from "react";

import { cn } from "@/lib/utils";
import { Icon } from "@/types";

const TonIcon = ({ className, onClick }: Icon) => {
	return (
		<div onClick={onClick} className={cn("h-5 w-5", className)}>
			<svg
				className="aspect-square h-full w-full"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g clipPath="url(#clip0_2028_1457)">
					<path
						d="M20.1036 -0.000366211H3.89546C0.91535 -0.000366211 -0.973515 3.21428 0.525777 5.81304L10.5289 23.1512C11.1816 24.2833 12.8175 24.2833 13.4702 23.1512L23.4753 5.81304C24.9726 3.21843 23.0837 -0.000366211 20.1057 -0.000366211H20.1036ZM10.5207 17.9517L8.34222 13.7355L3.08571 4.33417C2.73894 3.73244 3.16725 2.96135 3.89342 2.96135H10.5187V17.9538L10.5207 17.9517ZM20.9093 4.33214L15.6548 13.7376L13.4763 17.9517V2.95931H20.1016C20.8278 2.95931 21.2561 3.7304 20.9093 4.33214Z"
						fill="currentColor"
					/>
				</g>
				<defs>
					<clipPath id="clip0_2028_1457">
						<rect width="24" height="24" fill="white" />
					</clipPath>
				</defs>
			</svg>
		</div>
	);
};

export default TonIcon;
