import React from "react";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { hapticFeedback } from "@/lib/utils";
import Image from "next/image";

type Props = {};

const Achievements = (props: Props) => {
    return (
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
                                hapticFeedback();
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
                                hapticFeedback();
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
                                hapticFeedback();
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
                                hapticFeedback();
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
    );
};

export default Achievements;
