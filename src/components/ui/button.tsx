import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { hapticFeedback } from "@telegram-apps/sdk-react";

const buttonVariants = cva(
	"inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				unstyled: "",
				default:
					"bg-primary text-primary-foreground hover:bg-primary/90",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline:
					"border border-input bg-background hover:bg-accent hover:text-accent-foreground",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-tgaccent underline-offset-4 underline",
				light: "bg-white text-blue-500 hover:bg-white/90 font-bold",
				blue: "bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-black/10",
				telegram:
					"bg-tgaccent text-white hover:bg-tgaccent/90 shadow-lg shadow-black/10",
			},
			size: {
				fit: "h-fit w-fit p-0 m-0",
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				xl: "h-12 rounded-xl px-12 text-base",
				icon: "h-10 w-10",
				bean: "h-12 px-8 rounded-2xl min-w-24 text-xl capitalize font-medium",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, onClick, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				onClick={(e) => {
					if (
						hapticFeedback.isSupported() &&
						hapticFeedback.impactOccurred.isAvailable()
					) {
						hapticFeedback.impactOccurred("medium");
					}
					onClick?.(e);
				}}
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	}
);
Button.displayName = "Button";

export { Button, buttonVariants };
