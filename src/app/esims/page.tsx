"use client";

import Header from "@/components/shared/header";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { createUser } from "@/lib/supabase";
import { hapticFeedback, highlightText } from "@/lib/utils";
import { useTelegram } from "@/providers/telegram-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { MdArrowForwardIos } from "react-icons/md";
import { COUNTRIES } from "../constants";
import { IoClose, IoCloseOutline } from "react-icons/io5";
import { Link } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
    const { user: tgUser, webApp } = useTelegram();
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
                {/* 
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="px-10 h-10 border-0 rounded-full"
                    placeholder="Search country where you go"
                /> */}
                <input
                    className="px-10 h-10 border-0 rounded-full w-full"
                    value={search}
                    placeholder="Search country where you go"
                    onChange={(e) => setSearch(e.target.value)}
                />
                {search && (
                    <IoCloseOutline
                        onClick={() => {
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
                                    hapticFeedback(webApp);
                                    router.push(`/esims/${country.country_code}`);
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
                    <div>
                        <Carousel className="w-full max-w-sm">
                            <CarouselContent className="-ml-1">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <CarouselItem
                                        key={index}
                                        onClick={() => {
                                            hapticFeedback(webApp);
                                        }}
                                        className="pl-1  basis-28 active:scale-95 transition-transform cursor-pointer"
                                    >
                                        <div className="p-1">
                                            <div className="p-1 bg-gradient-to-tr from-pink-500  via-sky-500 to-emerald-500 rounded-[28px]">
                                                <div className="relative  aspect-square flex justify-center items-end rounded-3xl overflow-hidden ring-2 ring-[#EFEFF3]	">
                                                    <Image
                                                        width={736}
                                                        height={736}
                                                        className=" w-full h-full object-cover"
                                                        src={
                                                            "https://www.comarch.com/files-com/miniatures/file_455/eSIM-is-Going-Mainstream.736x460.574e7a70.jpg"
                                                        }
                                                        alt="news"
                                                    />
                                                    <span className="absolute text-[10px] text-white pb-2 uppercase">
                                                        News {index + 1}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h2 className="pl-4 uppercase font-medium text-neutral-500">
                            Popular countries
                        </h2>
                        <div className="grid grid-cols-4 grid-rows-2 gap-2 max-h-48">
                            <div
                                onClick={() => {
                                    hapticFeedback(webApp);
                                }}
                                className=" cursor-pointer active:scale-95 transition-transform relative flex justify-center items-end rounded-3xl overflow-hidden	"
                            >
                                <Image
                                    width={736}
                                    height={736}
                                    className=" w-full h-full object-cover"
                                    src={
                                        "https://s3-alpha-sig.figma.com/img/abb6/4c50/484ea1a86032000ebc0f04992146841e?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SsilR0Wxd4bD7m6oRVsaQ0HhKVKQonuAYjLtyPLobUqkUd54TogYcRdes-hOQSnpx4iaHaIV-R9rO9ddrqKWG9zbDEAeVg0lxJDU7EhLy5glixQMV0bOLFMqJmNHscTw4Z4wRKyJdnvTcWVcUYP2qSEJokwPJXOpDOrS4CxTGztxpPWdJyolv3FdtuZkselsHy8vzrPRjZ-Wt2p736RnSRBEBE9DnuxTJAfxJkH8GksIptJrLE2wFlfso2texfxhCfR5QP8Ske0q6dn5BxMeC63BrFtG5J8yGIwUFsrdYz-kX8sE54-jdeLDDo6KW9lyAAvTm0vu4mjLLYhw-~wCUw__"
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
                                    UAE
                                </span>
                            </div>
                            <div
                                onClick={() => {
                                    hapticFeedback(webApp);
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
                                    hapticFeedback(webApp);
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
                                    hapticFeedback(webApp);
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

                    <div className="flex flex-col gap-2">
                        <div className="pl-4 flex  gap-2 uppercase items-center font-medium text-neutral-500">
                            <h2>ACHIEVEMENTS</h2>{" "}
                            <span className=" bg-neutral-500 text-white px-1 py-0.5 rounded-md text-xs">
                                NFT
                            </span>
                        </div>
                        <div>
                            <Carousel className="w-full max-w-sm">
                                <CarouselContent className="-ml-1">
                                    <CarouselItem
                                        onClick={() => {
                                            hapticFeedback(webApp);
                                        }}
                                        className=" cursor-pointer pl-1  basis-28 active:scale-95 transition-transform"
                                    >
                                        <div className="p-1">
                                            <div className="p-1 bg-gradient-to-tr from-pink-500  via-sky-500 to-emerald-500 rounded-[28px]">
                                                <div className="relative  aspect-square flex justify-center items-end rounded-3xl overflow-hidden ring-2 ring-[#EFEFF3]	">
                                                    <Image
                                                        width={736}
                                                        height={736}
                                                        className=" w-full h-full object-cover brightness-50"
                                                        src={
                                                            "https://s3-alpha-sig.figma.com/img/32b4/af82/8f17d7d40b84bb2416f4eafcd4b6fd87?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=jkGM5a6-l6B9qQPF2pE1WGi2o4BQ-IO9rdwFh2cuNo7IraQ8f5A21yozuvd0F~0XhlCoMpfabDKmnCgQgQhZAlruuHkOg8dCUXo7IT4phma6JsMeQ3tzrfyt8y3f2-PpgrCBKBRMEcXCZ8XogNvH2vAGolcC-KKMBqTBKeAjq1p1IVE0HOL8Xfv~4YRx3B1K1BjYO~6uwK38b62Wb5Sgc5bR5uKln4j96gdKOwEm1cJDW2fcO9LSBOMb~oyLVPsvi2AT9MM6EO9IwpJK~r2~q-rDKyukXchRuM~FXij4E5Up8kChdj5PhVBfHKKuwYJaYIrZM3OdplhzjthPImFtWA__"
                                                        }
                                                        alt="news"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                    <CarouselItem
                                        onClick={() => {
                                            hapticFeedback(webApp);
                                        }}
                                        className="pl-1  cursor-pointer  basis-28 active:scale-95 transition-transform"
                                    >
                                        <div className="p-1">
                                            <div className="p-1 bg-gradient-to-tr from-pink-500  via-sky-500 to-emerald-500 rounded-[28px]">
                                                <div className="relative  aspect-square flex justify-center items-end rounded-3xl overflow-hidden ring-2 ring-[#EFEFF3]	">
                                                    <Image
                                                        width={736}
                                                        height={736}
                                                        className=" w-full h-full object-cover"
                                                        src={
                                                            "https://s3-alpha-sig.figma.com/img/85bd/ee2a/562b75df00fa43fa930895342f8197f8?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=SOXjbo~zlkwPSrVMKdv-zOdN6XXMR71klzChhqFIML9rVltpEeCPXD1mnR8wSBw71ZMtMm8VyFJRaMxHhZAsqJI~JuW3ugOylZmWaZAKmbOwSfyg6o4OKRHLcHoA4bSUqh65AHOzW8~5ual2n4o0e2A7FRteufsu4t8YwS5IXoW4z01A~MJhIFUGJdv2dl1ZZ6pmXzYPkR1j~PobvAuezEhaYyqSaXSZa6uDmB6i04HMcxIsOcvKQUGxOKRAktfTkmlhjPG53xEkB~3mpiR4ceMH0W1LcHujfaHNL~dsOlyQ-H5hk-C48mknzjn1nLSGkaAXDsqfgIsH4v-heIxdjw__"
                                                        }
                                                        alt="news"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                    <CarouselItem
                                        onClick={() => {
                                            hapticFeedback(webApp);
                                        }}
                                        className="pl-1  cursor-pointer basis-28 active:scale-95 transition-transform"
                                    >
                                        <div className="p-1">
                                            <div className="p-1 bg-gradient-to-tr from-pink-500  via-sky-500 to-emerald-500 rounded-[28px]">
                                                <div className="relative  aspect-square flex justify-center items-end rounded-3xl overflow-hidden ring-2 ring-[#EFEFF3]	">
                                                    <Image
                                                        width={736}
                                                        height={736}
                                                        className=" w-full h-full object-cover"
                                                        src={
                                                            "https://s3-alpha-sig.figma.com/img/013c/4b62/1ba3438e9f90f6afd403f5df6c47491e?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=miy1fMcGxFIgPQMyR0-3QjShOtCqC0eRY4SQJPH10msb69T2VUwnCVt8pKKsnIPwcl8OQaT5NIMfux4K5NQOcHc2M~j4eY5jIuuy4XfB52Al2EsBs9kZBsbJIElCUP8H8nBuOO-PRgxDt4wr27fkMYwNc-qvWxj1S~foygLUEE5iVw3o-DCzs9FAao4QSNg45sWjewQRZdIbpIFgH0CflDyl9WrMIHpOWSdFPGMRsjKBLURmGH0BisgS-y8CfE6NpMvvLMSO8LwVp09h3TyS8UzkMSdubEczXCzz~2H5Io9gMpFI9CwFE48R8Qu~jm63CXmeI7RfoRYx5~pmwhTyog__"
                                                        }
                                                        alt="news"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                    <CarouselItem
                                        onClick={() => {
                                            hapticFeedback(webApp);
                                        }}
                                        className="pl-1  cursor-pointer basis-28 active:scale-95 transition-transform"
                                    >
                                        <div className="p-1">
                                            <div className="p-1 bg-gradient-to-tr from-pink-500  via-sky-500 to-emerald-500 rounded-[28px]">
                                                <div className="relative  aspect-square flex justify-center items-end rounded-3xl overflow-hidden ring-2 ring-[#EFEFF3]	">
                                                    <Image
                                                        width={736}
                                                        height={736}
                                                        className=" w-full h-full object-cover"
                                                        src={
                                                            "https://s3-alpha-sig.figma.com/img/b437/f62e/52cb8e3c9b2b7c9dd2cee5692d9cfc75?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=m9sA75~KSVHNXI7FeHJRvIakQa2Vy-2aa~GqW7fOO6ZlFuX4wvn-EjGYlN9L-x0-ovgohPYWo~VV~fyTGPWqqwoeusavghv3PE9Z4A~JiTE0-mKgsS-BC0RZR9ccFSqNy-4XD18M6y4VsxeK1OMHEh~fk7YnDVzWgQTgLS~KpYX26Lw61MTH8W-mbOm54nsWhHFec~t~rM4UXY195UeuAOVv80OVLoTDhl-zDYE3H2yiEAra5W8POJ0Bszn2S7cuOcdafWLh0WS3CSxCUgNUdRPCm93XaLzrWcDBPGVsI0Qxfsizi0p6AXO2T2Rme5bY3f3ttFqZ6Glvr5oLCIpoIw__"
                                                        }
                                                        alt="news"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CarouselItem>
                                </CarouselContent>
                            </Carousel>
                        </div>
                    </div>

                </div>
            )}
        </main>
    );
}
