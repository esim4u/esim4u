import React from "react";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";

import { l } from "@/lib/locale";
import { cn, hapticFeedback } from "@/lib/utils";

type SearchInputProps = {
    id?: string;
    search: string;
    placeholder?: string;
    setSearch: (search: string) => void;
    isError?: boolean;
    isFocused?: boolean;
    setIsFocused?: (isFocused: boolean) => void;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

const SearchInput = ({
    id,
    search,
    setSearch,
    placeholder = l("input_search_country"),
    isError,
    isFocused,
    setIsFocused,
    onFocus,
    onBlur,
}: SearchInputProps) => {
    return (
        <div
            id={id}
            className={cn(
                "relative flex items-center",
                isError && "animate-wiggle rounded-full ring-2 ring-redish",
            )}
        >
            <HiMiniMagnifyingGlass
                className={cn(
                    " absolute ml-[14px] text-neutral-500",
                    isError && "text-redish",
                )}
            />
            <input
                className={cn(
                    "h-10 w-full rounded-full px-10 ring-redish focus-visible:outline-none",
                    isError && "text-redish",
                )}
                value={search}
                placeholder={placeholder}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={onFocus}
            />

            {(search || isFocused) && (
                <IoCloseOutline
                    onClick={() => {
                        hapticFeedback();
                        setSearch("");
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

export default SearchInput;
