import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

type Props = {} & React.ComponentProps<typeof Button> & ButtonProps;

const BottomStickyButton = (props: Props) => {
	return (
		<>
			<div className="h-12 pt-1.5 safe-area-bottom w-full"></div>
			<div
				className={cn(
					"container fixed bottom-0 p-0 pt-1.5 w-full z-20 bg-background border-t-[1px] border-neutral-300 safe-area-bottom"
				)}
			>
				<div className="px-4">
					<Button
						{...props}
						variant={"telegram"}
						size={"xl"}
						className={cn("rounded-2xl w-full", props.className)}
					>
						{props.children}
					</Button>
				</div>
			</div>
		</>
	);
};

export default BottomStickyButton;
