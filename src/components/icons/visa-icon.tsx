import React from "react";

import { cn } from "@/lib/utils";
import { Icon } from "@/types";

const VisaIcon = ({ className, onClick }: Icon) => {
	return (
		<div onClick={onClick} className={cn("h-5 w-5", className)}>
			<svg
				className="aspect-square !h-full !w-full"
				enableBackground="new -822 823.1 56.7 56.7"
				height="44px"
				id="Layer_1"
				version="1.1"
				viewBox="-822 823.1 56.7 56.7"
				width="44px"
				fill="#005BAC"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g>
					<polygon points="-797.8,845.3 -801.1,860.5 -797.1,860.5 -793.9,845.3  " />
					<path d="M-803.6,845.3l-4.1,10.3l-1.7-8.8c-0.2-1-1-1.5-1.8-1.5h-6.7l-0.1,0.4c1.4,0.3,2.9,0.8,3.9,1.3c0.6,0.3,0.7,0.6,0.9,1.3   l3.1,12.1h4.2l6.4-15.2H-803.6z" />
					<path d="M-772.5,845.3h-3.4c-0.8,0-1.4,0.4-1.7,1.1l-5.9,14.1h4.1l0.8-2.3h5l0.5,2.3h3.6L-772.5,845.3z M-777.3,855.1l2.1-5.7   l1.2,5.7H-777.3z" />
					<path d="M-788.7,849.5c0-0.5,0.5-1.1,1.7-1.3c0.6-0.1,2.1-0.1,3.9,0.7l0.7-3.2c-0.9-0.3-2.2-0.7-3.7-0.7c-3.9,0-6.6,2.1-6.6,5   c0,2.2,2,3.4,3.4,4.1c1.5,0.7,2,1.2,2,1.9c0,1-1.2,1.5-2.4,1.5c-2,0-3.1-0.5-4-1l-0.7,3.3c0.9,0.4,2.6,0.8,4.4,0.8   c4.1,0,6.8-2,6.8-5.2C-783.2,851.6-788.8,851.3-788.7,849.5z" />
				</g>
			</svg>
		</div>
	);
};

export default VisaIcon;
