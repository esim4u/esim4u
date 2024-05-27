import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { cn, hapticFeedback } from "@/lib/utils";
import Image from "next/image";

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
    if ("coming soon")
        return (
            <div className=" w-full">
                <div className="relative flex flex-col items-center justify-center gap-2 bg-white rounded-3xl h-[180px] w-full">
                    <div
                        className={cn(
                            "absolute left-4 top-4 flex  gap-2 uppercase items-center font-medium text-neutral-500"
                        )}
                    >
                        <h2>ACHIEVEMENTS</h2>{" "}
                        <span className=" bg-neutral-500 text-white px-1 py-0.5 rounded-md text-xs">
                            NFT
                        </span>
                    </div>
                    <div className="flex flex-col gap-2 mt-1 items-center justify-center">
                        <h2 className="text-center font-medium text-3xl text-neutral-300">
                            COMING SOON
                        </h2>
                    </div>
                </div>
            </div>
        );

    return (
        <div className={cn("flex flex-col gap-2", fullWidth && " -mx-5")}>
            <div
                className={cn(
                    "pl-4 flex  gap-2 uppercase items-center font-medium text-neutral-500",
                    fullWidth && "pl-8"
                )}
            >
                <h2>ACHIEVEMENTS</h2>{" "}
                <span className=" bg-neutral-500 text-white px-1 py-0.5 rounded-md text-xs">
                    NFT
                </span>
            </div>
            <div>
                <Carousel className="w-full">
                    <CarouselContent
                        className={cn("-ml-1", fullWidth && " pl-4 mr-4")}
                    >
                        {ACHIEVEMENTS.map((achievement_url, index) => {
                            return (
                                <CarouselItem
                                    key={index}
                                    onClick={() => {
                                        hapticFeedback();
                                    }}
                                    className=" cursor-pointer pl-1  basis-28 active:scale-95 transition-transform"
                                >
                                    <div className="p-1">
                                        <div className="p-1 bg-gradient-to-tr from-pink-500  via-sky-500 to-emerald-500 rounded-[28px]">
                                            <div className="relative  aspect-square flex justify-center items-end rounded-3xl overflow-hidden ring-2 ring-[#EFEFF3]	">
                                                <Image
                                                    width={312}
                                                    height={312}
                                                    className={cn(
                                                        " w-full h-full object-cover ",
                                                        index != 1 &&
                                                            " brightness-[55%]"
                                                    )}
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
