"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { cn, hapticFeedback } from "@/lib/utils";
import { useTelegram } from "@/providers/telegram-provider";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import {
    getStories,
    incrementStoryTotalViews,
    incrementStoryUniqueViews,
} from "@/services/supabase";

type Props = {};

const Stories = (props: Props) => {
    const { webApp } = useTelegram();
    const [checkedStories, setCheckedStories] = useState<string[]>([]);

    const { data: stories, isLoading } = useQuery({
        queryKey: ["stories"],
        queryFn: async () => {
            const data = await getStories();
            return data;
        },
    });

    useEffect(() => {
        if (webApp) {
            webApp?.CloudStorage?.getItem(
                "checked_stories",
                (err: any, result: any) => {
                    if (err) {
                        return null;
                    }
                    const arrayFromString = result.split(",");
                    setCheckedStories(arrayFromString);
                }
            );
        }
    }, [webApp]);

    return (
        <div>
            <Carousel className="w-full max-w-sm">
                <CarouselContent className="-ml-1">
                    {stories?.map((story, index) => {
                        return (
                            <CarouselItem
                                key={index}
                                onClick={async () => {
                                    await incrementStoryTotalViews(story.id);

                                    if (
                                        !stories.includes(
                                            story.id.toString().trim()
                                        )
                                    ) {
                                        await incrementStoryUniqueViews(
                                            story.id
                                        );
                                    }

                                    webApp?.openLink(story.telegraph_url, {
                                        try_instant_view: true,
                                    });
                                    hapticFeedback();

                                    let unique = new Set([
                                        ...checkedStories,
                                        story.id.toString().trim(),
                                    ]);
                                    const newCheckedStories =
                                        Array.from(unique);

                                    setCheckedStories(newCheckedStories);

                                    webApp?.CloudStorage.setItem(
                                        "checked_stories",
                                        newCheckedStories.join(",")
                                    );
                                }}
                                className="pl-1  basis-24 active:scale-95 transition-transform cursor-pointer"
                            >
                                <div className="p-1">
                                    <div
                                        className={cn(
                                            "p-1 rounded-full transition-all",
                                            checkedStories.length > 0 &&
                                                !checkedStories.includes(
                                                    story.id.toString().trim()
                                                )
                                                ? " bg-gradient-to-tr from-pink-500  via-sky-500 to-emerald-500"
                                                : "bg-neutral-400/15"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "relative  aspect-square flex justify-center items-end rounded-full overflow-hidden ring-2 ring-[#EFEFF3] "
                                            )}
                                        >
                                            <div className="relative w-full h-full">
                                                <Image
                                                    width={736}
                                                    height={736}
                                                    className=" w-full h-full object-cover"
                                                    src={
                                                        story?.photo_url ||
                                                        "https://www.comarch.com/files-com/miniatures/file_455/eSIM-is-Going-Mainstream.736x460.574e7a70.jpg"
                                                    }
                                                    alt="news"
                                                />
                                                <div className="absolute bottom-0 h-2/3 w-full bg-gradient-to-t from-black/55">
                                                    {" "}
                                                </div>
                                            </div>

                                            <span className="absolute text-[10px] text-white text-center font-medium pb-2 uppercase leading-3 text-shadow shadow-black ">
                                                {story?.title}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </CarouselItem>
                        );
                    })}
                </CarouselContent>
            </Carousel>
        </div>
    );
};

export default Stories;
