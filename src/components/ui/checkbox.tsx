"use client";

import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

import { cn } from "@/lib/utils";
import { FaCheck } from "react-icons/fa";
import { hapticFeedback } from "@telegram-apps/sdk-react";

const Checkbox = React.forwardRef<
	React.ElementRef<typeof CheckboxPrimitive.Root>,
	React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, onCheckedChange, ...props }, ref) => (
	<CheckboxPrimitive.Root
		ref={ref}
		onCheckedChange={(e) => {
			if (
				hapticFeedback.isSupported() &&
				hapticFeedback.impactOccurred.isAvailable()
			) {
				hapticFeedback.impactOccurred("medium");
			}
			onCheckedChange?.(e);
		}}
		className={cn(
			"transition-colors peer h-7 w-7 shrink-0 rounded-[10px] border border-neutral-600 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-neutral-600 data-[state=checked]:text-primary-foreground",
			className
		)}
		{...props}
	>
		<CheckboxPrimitive.Indicator
			className={cn("flex items-center justify-center text-current")}
		>
			<FaCheck className="h-3 w-3" />
		</CheckboxPrimitive.Indicator>
	</CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
