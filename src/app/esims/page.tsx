"use client";

import Header from "@/components/home/header";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { copyText, getReferralLink, hapticFeedback } from "@/lib/utils";
import { useTelegram } from "@/providers/telegram-provider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { MdArrowForwardIos } from "react-icons/md";
import { COUNTRIES } from "../../constants";
import { IoClose, IoCloseOutline } from "react-icons/io5";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";
import Stories from "@/components/shared/stories";
import Achievements from "@/components/shared/achievements";

export default function Home() {
    const { webApp } = useTelegram();
    const [search, setSearch] = useState("");
    const router = useRouter();

    const { data: packages, isLoading } = useQuery({
        queryKey: ["esim-packages"],
        queryFn: async () => {
            const { data } = await axios.get("/api/esims/packages");
            return data;
        },
    });

    const highlightMatches = (search: string, title: string) => {
        const regex = new RegExp(`(${search})`, "gi");
        return title.split(regex).map((part, index) => {
            return regex.test(part) ? (
                <span key={index} className="highlight text-blue-500">
                    {part}
                </span>
            ) : (
                part
            );
        });
    };

    useEffect(() => {
        if (webApp) {
            webApp?.MainButton.setParams({
                text: "Share with friends",
                color: "#3b82f6",
                is_active: true,
                is_visible: true,
            });
        }
    }, [webApp]);

    const copyReferralLink = useCallback(() => {
        if (webApp) {
            hapticFeedback();
            copyText(
                getReferralLink(webApp?.initDataUnsafe?.user?.id.toString())
            );
        }
    }, [webApp]);

    useEffect(() => {
        webApp?.onEvent("mainButtonClicked", copyReferralLink);
        return () => {
            webApp?.offEvent("mainButtonClicked", copyReferralLink);
        };
    }, [webApp]);

    const filteredPackages = useMemo(() => {
        if (search && packages && packages.length) {
            const query = search.toLowerCase().trim();

            let nestedMatchCountries: any = {};
            let matchingPackages = packages.filter((item: any) => {
                let hasCoverage = [];
                if (!item.slug.includes(query)) {
                    hasCoverage = item.operators[0].coverages
                        .filter(
                            (coverage: any) =>
                                coverage.name.toLowerCase().includes(query) ||
                                COUNTRIES[coverage.name.toLowerCase()]
                                    ?.toLowerCase()
                                    .includes(query)
                        )
                        .map((coverage: any) => {
                            return {
                                ...coverage,
                                fullName:
                                    COUNTRIES[coverage.name.toLowerCase()] ||
                                    coverage.name,
                            };
                        });
                }

                if (hasCoverage.length) {
                    nestedMatchCountries = {
                        ...nestedMatchCountries,
                        [item.slug]: hasCoverage,
                    };
                }
                return (
                    item.slug.toLowerCase().includes(query) ||
                    hasCoverage.length
                );
            });
            matchingPackages = matchingPackages.map((item: any) => {
                return {
                    ...item,
                    nestedMatchCountries: nestedMatchCountries[item.slug],
                };
            });
            return matchingPackages;
        }
    }, [packages, search]);

    return (
        <main className="overflow-x-hidden flex flex-col h-dvh p-5 gap-4">
            <Header />
            <div className="relative flex items-center">
                <HiMiniMagnifyingGlass className=" absolute ml-[14px] text-neutral-500" />
                <input
                    className="px-10 h-10 border-0 rounded-full w-full"
                    value={search}
                    placeholder="Search country where you go"
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

            {filteredPackages && filteredPackages.length ? (
                <div className="flex flex-col gap-2">
                    {filteredPackages.map((country: any, index: number) => {
                        return (
                            <div
                                onClick={() => {
                                    hapticFeedback();
                                    webApp?.MainButton.setParams({
                                        text: "PAY",
                                        color: "#444444",
                                        is_active: false,
                                        is_visible: true,
                                    });
                                    router.push(
                                        `/esims/${
                                            country.country_code || country.slug
                                        }`
                                    );
                                }}
                                key={index}
                                className="cursor-pointer active:scale-95 transition-transform bg-white flex items-center justify-between w-full p-2 rounded-xl"
                            >
                                <div className="flex flex-row items-center gap-4">
                                    <Image
                                        width={32}
                                        height={24}
                                        src={country.image.url}
                                        alt={country.title}
                                        className="rounded-md w-8 h-6"
                                    />
                                    <span className=" font-semibold">
                                        {highlightMatches(
                                            search,
                                            country.title
                                        )}
                                    </span>
                                </div>

                                {country.nestedMatchCountries && (
                                    <span className=" font-semibold text-sm">
                                        incl.
                                        {highlightMatches(
                                            search,
                                            country.nestedMatchCountries[0]
                                                .fullName
                                        )}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    <Stories />
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
                                    width={736}
                                    height={736}
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
                                    width={736}
                                    height={736}
                                    className=" w-full h-full object-cover"
                                    src={
                                        "https://s3-alpha-sig.figma.com/img/1f76/2cb7/266a5e95b2e9d2372e782311a9268523?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=DuWF2Kqkd1ZjaluInK7sDZgthaiE2rmlTe5OpAdClPpri2RXdAqr6N8YO75q4cje-qvevpSOO0eMDu8xrPtTMErltcYF4htW~U-gQkolraAcfrrqspI49PciBNP-UYR0Hc2yl4BdVShYR3c1bZ5ksQRupWx-yRlt7XUdPcY26dqxfyMuOWoIIkLid5UcvzhhZLv0E0YimSKfCa0EttB5n7PSTXFSAdYsAX2b0xMNXdGxfnj~rKz2XLOHchj41hIwHto-AOZAaxhwww1EM8o0wgqqI-VjwoyS-g1CTj2Pn32rqGwWwfH-lZ3hyl4H4ewwG~XEKiBSE4dWEuw7FFLrGQ__"
                                    }
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
                                    width={736}
                                    height={736}
                                    className=" w-full h-full object-cover"
                                    src={
                                        "https://s3-alpha-sig.figma.com/img/cf58/2b23/9ce597079a38aa3d3189fcc059121645?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=oia9LMj5WF~PoBNuLd2I~pTH1EG~CrkqdR8KKboXHsP6ekg3Kqw7JQeKBKAUiHtQqsOWTvR0VOm12m0X3ZHWyRgj7M~eNUK2vWEwd5e~~mufaUmMJ1164WEVxzQnDxuM0XDAWw-690ZTqkn9txXMQlVCRCdkJFsrcSkNqgu3pUiTiJUa3sPa7QoYI2wz04o5wkilvkaz3ma7y35~gXdnHJt9xDImTHty1sb0OSCgYyPiXN81ZQrThwbxnaIwGsKNwSkhB6gTP8mDHLmT42XcAzmsGksDhwAZwxICsZq0v2yAz~AseDklX10YyJjzGXvdm9GlAGz8LjuTqGMv46fKVQ__"
                                    }
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
                                    width={736}
                                    height={736}
                                    className=" w-full h-full object-cover"
                                    src={
                                        "https://s3-alpha-sig.figma.com/img/fe16/ee05/4fdb12ce221feda8da1d52059f7655ed?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=gPhhjk383HJjBGV~hof2e426amq9XT2fIBTdUfs8xdCuftWcmwiqPKHQxdGOB7S~KSIg1IzOvr8yF8a1gkiKk9xlN88A4w1Oi8wQATUymhxWVfNnDozdPor826~jbbIOlDncwwFc~HOk7mHERWLirLAzJQ9dVfNvWDAyjVgqwHZNkMKo18T~pw300pvpK8uzsbEECt~sn8mpKmSIjeQaH5cLre2WyiV2HM~2WTZC0bKorlvrJtCH1yAwc2SMC2Aef7FvdfhYB~9R-S268foGj2uEH89I3fOc7jqjlqhtA8-ydFepDuqIIk2-R7y9APIsf2okZ20~7376wdj~eC2zvQ__"
                                    }
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
                    <Achievements />
                </div>
            )}
        </main>
    );
}
