import React from "react";
import { IoCloseOutline } from "react-icons/io5";

import { cn } from "@/lib/utils";
import { l } from "@/features/locale/lib/locale";
import { Button } from "./button";

type CustomInputProps = {
	id?: string;
	value: string | number;
	type?: string;
	placeholder?: string;
	setValue: (search: string) => void;
	isError?: boolean;
	isFocused?: boolean;
	setIsFocused?: (isFocused: boolean) => void;
	onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
	icon?: any;
	onClear?: () => void;
	className?: string;
};

const CustomInput = ({
	id,
	value,
	type = "text",
	setValue,
	placeholder = l("input_search_country"),
	isError,
	isFocused,
	setIsFocused,
	onFocus,
	onBlur,
	icon,
	onClear,
	className,
}: CustomInputProps) => {
	const Icon = icon;

	return (
		<div
			id={id}
			className={cn(
				"relative flex items-center",
				isError && "animate-wiggle rounded-full ring-2 ring-redish",
				className
			)}
		>
			{icon && (
				<Icon
					className={cn(
						" absolute ml-[14px] text-neutral-500",
						isError && "text-redish"
					)}
				/>
			)}
			<input
				type={type}
				className={cn(
					"h-10 w-full rounded-full px-4 ring-redish focus-visible:outline-none",
					isError && "text-redish",
					icon && "pl-10"
				)}
				value={value}
				placeholder={placeholder}
				onChange={(e) => setValue(e.target.value)}
				onFocus={onFocus}
			/>

			{(value || isFocused) && (
				<Button
					variant={"unstyled"}
					onClick={() => {
						if (onClear) {
							onClear();
						} else {
							setValue("");
						}
						if (setIsFocused) {
							setIsFocused(false);
						}
					}}
					size={"fit"}
					className="absolute right-1  h-10 w-10"
				>
					<IoCloseOutline
						className={cn(
							"h-5 w-5  text-neutral-500",
							isError && "text-redish"
						)}
					/>
				</Button>
			)}
		</div>
	);
};

export default CustomInput;
