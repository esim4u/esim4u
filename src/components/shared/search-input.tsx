import { l } from "@/lib/locale";
import { hapticFeedback } from "@/lib/utils";
import React from "react";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { IoCloseOutline } from "react-icons/io5";

type SearchInputProps = {
    search: string;
    placeholder?: string;
    setSearch: (search: string) => void;
};

const SearchInput = ({
    search,
    setSearch,
    placeholder = l("input_search_country"),
}: SearchInputProps) => {
    return (
        <div className="relative flex items-center">
            <HiMiniMagnifyingGlass className=" absolute ml-[14px] text-neutral-500" />
            <input
                className="px-10 h-10 border-0 rounded-full w-full"
                value={search}
                placeholder={placeholder}
                onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
                <IoCloseOutline
                    onClick={() => {
                        hapticFeedback();
                        setSearch("");
                    }}
                    className="cursor-pointer w-5 h-5 right-[14px] absolute text-neutral-500"
                />
            )}
        </div>
    );
};

export default SearchInput;
