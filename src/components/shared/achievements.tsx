import React from "react";
import Image from "next/image";
import { GiAchievement } from "react-icons/gi";

import { l } from "@/lib/locale";
import { cn } from "@/lib/utils";

import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";

type Props = {
    fullWidth?: boolean;
};

const ACHIEVEMENTS = [
    "/img/achievements/1.png",
    "/img/achievements/2.png",
    "/img/achievements/3.png",
    "/img/achievements/4.png",
];
const Achievements = ({ fullWidth = false }: Props) => {
    if (true) {
        return (
            <div className=" w-full">
                <div className="relative flex h-[180px] w-full flex-col items-center justify-center gap-2 rounded-3xl bg-white">
                    <div
                        className={cn(
                            "absolute left-4 top-4 flex  items-center gap-2 font-medium uppercase text-neutral-500",
                        )}
                    >
                        <h2>{l("title_achievements")}</h2>{" "}
                        <span className=" rounded-md bg-neutral-500 px-1 py-0.5 text-xs text-white">
                            NFT
                        </span>
                    </div>
                    <div className="mt-1 flex flex-col items-center justify-center gap-2">
                        {/* <h2 className="text-center font-medium text-3xl text-neutral-300">
                            {l("coming_soon")}
                        </h2> */}
                        <GiAchievement className=" size-[68px] text-neutral-300/75" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("flex flex-col gap-2", fullWidth && " -mx-5")}>
            <div
                className={cn(
                    "flex items-center  gap-2 pl-4 font-medium uppercase text-neutral-500",
                    fullWidth && "pl-8",
                )}
            >
                <h2>{l("title_achievements")}</h2>{" "}
                <span className=" rounded-md bg-neutral-500 px-1 py-0.5 text-xs text-white">
                    NFT
                </span>
            </div>
            <div>
                <Carousel className="w-full">
                    <CarouselContent
                        className={cn("-ml-1", fullWidth && " mr-4 pl-4")}
                    >
                        {ACHIEVEMENTS.map((achievement_url, index) => {
                            return (
                                <CarouselItem
                                    key={index}
                                    onClick={() => {}}
                                    className=" basis-28 cursor-pointer  pl-1 transition-transform active:scale-95"
                                >
                                    <div className="p-1">
                                        <div className="rounded-[28px] bg-gradient-to-tr from-pink-500  via-sky-500 to-emerald-500 p-1">
                                            <div className="relative  flex aspect-square items-end justify-center overflow-hidden rounded-3xl ring-2 ring-[#EFEFF3]	">
                                                <Image
                                                    width={312}
                                                    height={312}
                                                    className={cn(
                                                        " h-full w-full object-cover ",
                                                        index != 1 &&
                                                            " brightness-[55%]",
                                                    )}
                                                    quality={25}
                                                    placeholder="blur"
                                                    blurDataURL={
                                                        achievement_url
                                                    }
                                                    src={achievement_url}
                                                    alt="news"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CarouselItem>
                            );
                        })}
                    </CarouselContent>
                </Carousel>
            </div>
        </div>
    );
};

export default Achievements;
