import { l } from "@/lib/locale";
import { cn, hapticFeedback } from "@/lib/utils";
import React from "react";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";

type SearchInputProps = {
    id?: string;
    search: string;
    placeholder?: string;
    setSearch: (search: string) => void;
    isError?: boolean;
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
};

const SearchInput = ({
    id,
    search,
    setSearch,
    placeholder = l("input_search_country"),
    isError,
    onFocus,
    onBlur,
}: SearchInputProps) => {
    return (
        <div
            id={id}
            className={cn(
                "relative flex items-center",
                isError && "ring-2 ring-redish rounded-full"
            )}
        >
            <HiMiniMagnifyingGlass
                className={cn(
                    " absolute ml-[14px] text-neutral-500",
                    isError && "text-redish"
                )}
            />
            <input
                className={cn(
                    "px-10 h-10 rounded-full w-full ring-redish focus-visible:outline-none",
                    isError && "text-redish"
                )}
                value={search}
                placeholder={placeholder}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={onFocus}
                onBlur={onBlur}
            />
            {search && (
                <IoCloseOutline
                    onClick={() => {
                        hapticFeedback();
                        setSearch("");
                    }}
                    className={cn(
                        "cursor-pointer w-5 h-5 right-[14px] absolute text-neutral-500",
                        isError && "text-redish"
                    )}
                />
            )}
        </div>
    );
};

export default SearchInput;
