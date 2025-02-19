import React from "react";

import { cn } from "@/lib/utils";
import { Icon } from "@/types";

const QrIcon = ({ className, onClick }: Icon) => {
	return (
		<div onClick={onClick} className={cn("h-5 w-5", className)}>
			<svg
				className="aspect-square !h-full !w-full"
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g clipPath="url(#clip0_1048_204)">
					<path
						d="M10.4 0.6H14.4C14.9523 0.6 15.4 1.04772 15.4 1.6V5.6C15.4 6.15228 14.9523 6.6 14.4 6.6H10.4C9.84772 6.6 9.4 6.15228 9.4 5.6V1.6C9.4 1.04772 9.84772 0.6 10.4 0.6ZM1.6 9.4H5.6C6.15229 9.4 6.6 9.84772 6.6 10.4V14.4C6.6 14.9523 6.15228 15.4 5.6 15.4H1.6C1.04772 15.4 0.6 14.9523 0.6 14.4V10.4C0.6 9.84772 1.04772 9.4 1.6 9.4ZM1.6 0.6H5.6C6.15228 0.6 6.6 1.04772 6.6 1.6V5.6C6.6 6.15228 6.15228 6.6 5.6 6.6H1.6C1.04772 6.6 0.6 6.15228 0.6 5.6V1.6C0.6 1.04772 1.04772 0.6 1.6 0.6ZM9.4 10.2V9.4H10.2V10.2H9.4ZM10.2 15.4H9.4V14.6H10.2V15.4ZM15.4 14.6V15.4H14.6V14.6H15.4ZM15.4 9.4V10.2H14.6V9.4H15.4ZM13 11.8V13H11.8V11.8H13Z"
						stroke="#444444"
						strokeWidth="1.2"
					/>
				</g>
				<defs>
					<clipPath id="clip0_1048_204">
						<rect width="16" height="16" fill="white" />
					</clipPath>
				</defs>
			</svg>
		</div>
	);
};

export default QrIcon;
