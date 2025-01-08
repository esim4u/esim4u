import React from "react";

import { cn } from "@/lib/utils";
import { Icon } from "@/types";

const MastercardIcon = ({ className, onClick }: Icon) => {
	return (
		<div onClick={onClick} className={cn("h-5 w-5", className)}>
			<svg
				className="aspect-square !h-full !w-full"
				enableBackground="new 0 0 32 20"
				height="16"
				overflow="visible"
				viewBox="0 0 32 20"
				width="32"
				xmlns="http://www.w3.org/2000/svg"
			>
				<g>
					<g id="Master_Card_1_">
						<g id="Master_Card">
							<circle
								cx="10"
								cy="10"
								fill="#F93232"
								id="Red_x5F_Circle"
								r="10"
							/>
							<path
								d="M22,0c-2.246,0-4.312,0.75-5.98,2H16v0.014        C15.604,2.312,15.24,2.648,14.893,3h2.214c0.308,0.313,0.592,0.648,0.855,1H14.03c-0.242,0.319-0.464,0.652-0.667,1h5.264        c0.188,0.324,0.365,0.654,0.518,1h-6.291c-0.143,0.325-0.269,0.658-0.377,1h7.044c0.104,0.326,0.186,0.661,0.258,1h-7.563        c-0.067,0.328-0.123,0.66-0.157,1h7.881C19.979,9.328,20,9.661,20,10h-8c0,0.339,0.027,0.67,0.06,1h7.882        c-0.038,0.339-0.093,0.672-0.162,1h-7.563c0.069,0.341,0.158,0.673,0.261,1h7.044c-0.108,0.342-0.234,0.675-0.377,1h-6.291        c0.151,0.344,0.321,0.678,0.509,1h5.264c-0.202,0.348-0.427,0.681-0.669,1H14.03c0.266,0.352,0.553,0.687,0.862,1h2.215        c-0.348,0.353-0.711,0.688-1.107,0.986C17.672,19.245,19.745,20,22,20c5.523,0,10-4.478,10-10S27.523,0,22,0z"
								fill="#FED049"
								id="Yellow_x5F_Circle"
							/>
						</g>
					</g>
				</g>
			</svg>
		</div>
	);
};

export default MastercardIcon;
