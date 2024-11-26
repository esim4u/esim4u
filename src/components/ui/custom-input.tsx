import React from "react";
import { IoCloseOutline } from "react-icons/io5";

import { l } from "@/lib/locale";
import { cn } from "@/lib/utils";

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
}: CustomInputProps) => {
    const Icon = icon;

    return (
        <div
            id={id}
            className={cn(
                "relative flex items-center",
                isError && "animate-wiggle rounded-full ring-2 ring-redish",
            )}
        >
            {icon && (
                <Icon
                    className={cn(
                        " absolute ml-[14px] text-neutral-500",
                        isError && "text-redish",
                    )}
                />
            )}
            <input
                type={type}
                className={cn(
                    "h-10 w-full rounded-full px-4 ring-redish focus-visible:outline-none",
                    isError && "text-redish",
                    icon && "pl-10",
                )}
                value={value}
                placeholder={placeholder}
                onChange={(e) => setValue(e.target.value)}
                onFocus={onFocus}
            />

            {(value || isFocused) && (
                <IoCloseOutline
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
                    className={cn(
                        "absolute right-[14px] h-5 w-5 cursor-pointer text-neutral-500",
                        isError && "text-redish",
                    )}
                />
            )}
        </div>
    );
};

export default CustomInput;
