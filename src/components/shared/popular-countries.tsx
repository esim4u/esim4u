import { hapticFeedback } from "@/lib/utils";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { MdArrowForwardIos } from "react-icons/md";

type Props = {};

const PopularCountries = (props: Props) => {
    const router = useRouter();

    return (
        <div className="flex flex-col gap-2">
            <h2 className="pl-4 uppercase font-medium text-neutral-500">
                Popular countries
            </h2>
            <div className="grid grid-cols-4 grid-rows-2 gap-2 max-h-48">
                <div
                    onClick={() => {
                        hapticFeedback();
                        router.push("/esims/eg");
                    }}
                    className=" cursor-pointer active:scale-95 transition-transform relative flex justify-center items-end rounded-3xl overflow-hidden	"
                >
                    <Image
                        width={312}
                        height={312}
                        className=" w-full h-full object-cover"
                        src={"/img/countries/eg.jpeg"}
                        alt="news"
                    />
                    <div className="absolute h-1/2 w-full bg-gradient-to-t from-black/50">
                        {" "}
                    </div>

                    <div className=" absolute top-3 right-3 w-[18px] h-[18px] bg-white/75 blur-sm	 "></div>
                    <div className=" absolute top-3 right-3">
                        <MdArrowForwardIos className=" w-4 h-4 " />
                    </div>

                    <span className="absolute font-medium text-[10px] text-white pb-2 uppercase">
                        EGYPT
                    </span>
                </div>
                <div
                    onClick={() => {
                        hapticFeedback();
                        router.push("/esims/ch");
                    }}
                    className=" cursor-pointer active:scale-95 transition-transform relative  flex justify-center items-end rounded-3xl overflow-hidden "
                >
                    <Image
                        width={312}
                        height={312}
                        className=" w-full h-full object-cover"
                        src={"/img/countries/ch.png"}
                        alt="news"
                    />
                    <div className="absolute h-1/2 w-full bg-gradient-to-t from-black/50">
                        {" "}
                    </div>

                    <div className=" absolute top-3 right-3 w-[18px] h-[18px] bg-white/75 blur-sm	 "></div>
                    <div className=" absolute top-3 right-3">
                        <MdArrowForwardIos className=" w-4 h-4 " />
                    </div>

                    <span className="absolute font-medium text-[10px] text-white pb-2 uppercase">
                        SWITZERLAND
                    </span>
                </div>
                <div
                    onClick={() => {
                        hapticFeedback();
                        router.push("/esims/es");
                    }}
                    className=" cursor-pointer active:scale-95 transition-transform relative col-span-2 row-span-2 flex justify-center items-end rounded-3xl overflow-hidden 	"
                >
                    <Image
                        width={312}
                        height={312}
                        className=" w-full h-full object-cover"
                        src={"/img/countries/es.png"}
                        alt="news"
                    />
                    <div className="absolute h-1/2 w-full bg-gradient-to-t from-black/50">
                        {" "}
                    </div>

                    <div className=" absolute top-3 right-3 w-[18px] h-[18px] bg-white/75 blur-sm	 "></div>
                    <div className=" absolute top-3 right-3">
                        <MdArrowForwardIos className=" w-4 h-4 " />
                    </div>

                    <span className="absolute font-medium text-lg text-white pb-3 uppercase">
                        SPAIN
                    </span>
                </div>
                <div
                    onClick={() => {
                        hapticFeedback();
                        router.push("/esims/it");
                    }}
                    className=" cursor-pointer active:scale-95 transition-transform relative col-span-2 row-span-1  flex justify-center items-end rounded-3xl overflow-hidden 	"
                >
                    <Image
                        width={312}
                        height={312}
                        className=" w-full h-full object-cover"
                        src={"/img/countries/it.png"}
                        alt="news"
                    />
                    <div className="absolute h-1/2 w-full bg-gradient-to-t from-black/50">
                        {" "}
                    </div>

                    <div className=" absolute top-3 right-3 w-[18px] h-[18px] bg-white/75 blur-sm	 "></div>
                    <div className=" absolute top-3 right-3">
                        <MdArrowForwardIos className=" w-4 h-4 " />
                    </div>

                    <span className="absolute font-medium text-xs text-white pb-2 uppercase">
                        ITALY
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PopularCountries;
