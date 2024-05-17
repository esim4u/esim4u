"use client";

import { Button } from "@/components/ui/button";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from "@/components/ui/carousel";
import { createUser } from "@/services/supabase";
import { useTelegram } from "@/providers/telegram-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
    const router = useRouter();
    const { user: tgUser, webApp, start_param } = useTelegram();

    const createAppUser = useMutation({
        mutationFn: async (tgUser: any) => {
            return await createUser(tgUser, start_param);
        },
        onError: (error) => {},
        onSuccess: (data) => {},
    });

    useEffect(() => {
        if (tgUser && webApp) {
            webApp?.MainButton.hide()
            createAppUser.mutate(tgUser);
        }
    }, [tgUser, webApp]);

    return (
        <main className="overflow-x-hidden h-dvh flex justify-center items-center">
            <Carousel className="w-full">
                <CarouselContent className="">
                    <CarouselItem className="w-full h-dvh flex flex-col justify-center items-center">
                        <div className="flex flex-col gap-5 p-5">
                            <h2 className=" text-4xl font-medium text-center">
                                Revolutionary <br /> Telegram mini App
                            </h2>
                            <p className="text-center text-neutral-500">
                                Buy eSIM with crypto or card using your lovely
                                messenger wherever you go
                            </p>
                            <div className="flex flex-col gap-2">
                                <div className="grid grid-cols-4 grid-rows-2 gap-2 max-h-48">
                                    <div className="relative flex justify-center items-end rounded-3xl overflow-hidden	">
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

                                        <span className="absolute font-medium text-[10px] text-white pb-2 uppercase">
                                            UAE
                                        </span>
                                    </div>
                                    <div className="relative  flex justify-center items-end rounded-3xl overflow-hidden ">
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

                                        <span className="absolute font-medium text-[10px] text-white pb-2 uppercase">
                                            SWITZERLAND
                                        </span>
                                    </div>
                                    <div className="relative col-span-2 row-span-2 flex justify-center items-end rounded-3xl overflow-hidden 	">
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

                                        <span className="absolute font-medium text-lg text-white pb-3 uppercase">
                                            SPAIN
                                        </span>
                                    </div>
                                    <div className="relative col-span-2 row-span-1  flex justify-center items-end rounded-3xl overflow-hidden 	">
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

                                        <span className="absolute font-medium text-xs text-white pb-2 uppercase">
                                            ITALY
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                    <CarouselItem className="w-full h-dvh flex flex-col justify-center items-center">
                        <div className="flex flex-col gap-5 p-5">
                            <h2 className=" text-4xl font-medium text-center">
                                Dozens <br />
                                of countries
                            </h2>
                            <p className="text-center text-neutral-500">
                                The first place in Telegram that allows you to
                                get eSIM in more than 160 countries
                            </p>
                            <div className="flex flex-col gap-2">
                                <div className=" grid grid-cols-8 gap-2">
                                    <div className=" col-span-1 row-span-2 aspect-square"></div>
                                    <div className="rounded-full overflow-hidden col-span-2 row-span-2 aspect-square">
                                        <Image
                                            width={128}
                                            height={128}
                                            className=" object-cover"
                                            src={
                                                "https://s3-alpha-sig.figma.com/img/6e24/4a4c/7303f08d0e5256baac6d7c2079772198?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ErHFqB6ixATqqLXwAKZWzs42ikMOii19TadXAUBQcG0Zb4Mhi~PK2V3L~2ak5a6lGINCPHeIjUZiRQ21eCpihWCgKYAFODVpfHkRdTFSdzLSS5hd9GbujTFAvMUMGSiWdgl2f2izMQ7xBdDEg5YPJ7CNaaLQesAPY4SPnHaFfA-QBj6SjUjfWa1ei~GVPu8Sin~JRH~NhwsjrAFY5NfGE-1AkregqTMu6N1carPYtWuegI8IuLL85-fWL2YeaI~9uoVrSzTb1bWNNjcLpyFRjvxjE884b561Q3Q70VVuQsRh4Uqw4yOqApkWeurd867LXHkxOrherrh1SNkqy6sZfw__"
                                            }
                                            alt="country"
                                        />
                                    </div>
                                    <div className="rounded-full overflow-hidden col-span-2 row-span-2 aspect-square">
                                        <Image
                                            width={128}
                                            height={128}
                                            className=" object-cover"
                                            src={
                                                "https://s3-alpha-sig.figma.com/img/6e24/4a4c/7303f08d0e5256baac6d7c2079772198?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ErHFqB6ixATqqLXwAKZWzs42ikMOii19TadXAUBQcG0Zb4Mhi~PK2V3L~2ak5a6lGINCPHeIjUZiRQ21eCpihWCgKYAFODVpfHkRdTFSdzLSS5hd9GbujTFAvMUMGSiWdgl2f2izMQ7xBdDEg5YPJ7CNaaLQesAPY4SPnHaFfA-QBj6SjUjfWa1ei~GVPu8Sin~JRH~NhwsjrAFY5NfGE-1AkregqTMu6N1carPYtWuegI8IuLL85-fWL2YeaI~9uoVrSzTb1bWNNjcLpyFRjvxjE884b561Q3Q70VVuQsRh4Uqw4yOqApkWeurd867LXHkxOrherrh1SNkqy6sZfw__"
                                            }
                                            alt="country"
                                        />
                                    </div>
                                    <div className="rounded-full overflow-hidden col-span-2 row-span-2 aspect-square">
                                        <Image
                                            width={128}
                                            height={128}
                                            className=" object-cover"
                                            src={
                                                "https://s3-alpha-sig.figma.com/img/6e24/4a4c/7303f08d0e5256baac6d7c2079772198?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ErHFqB6ixATqqLXwAKZWzs42ikMOii19TadXAUBQcG0Zb4Mhi~PK2V3L~2ak5a6lGINCPHeIjUZiRQ21eCpihWCgKYAFODVpfHkRdTFSdzLSS5hd9GbujTFAvMUMGSiWdgl2f2izMQ7xBdDEg5YPJ7CNaaLQesAPY4SPnHaFfA-QBj6SjUjfWa1ei~GVPu8Sin~JRH~NhwsjrAFY5NfGE-1AkregqTMu6N1carPYtWuegI8IuLL85-fWL2YeaI~9uoVrSzTb1bWNNjcLpyFRjvxjE884b561Q3Q70VVuQsRh4Uqw4yOqApkWeurd867LXHkxOrherrh1SNkqy6sZfw__"
                                            }
                                            alt="country"
                                        />
                                    </div>
                                </div>
                                <div className=" grid grid-cols-8 gap-2">
                                    <div className="rounded-full overflow-hidden col-span-2 row-span-2 aspect-square">
                                        <Image
                                            width={128}
                                            height={128}
                                            className=" object-cover"
                                            src={
                                                "https://s3-alpha-sig.figma.com/img/6e24/4a4c/7303f08d0e5256baac6d7c2079772198?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ErHFqB6ixATqqLXwAKZWzs42ikMOii19TadXAUBQcG0Zb4Mhi~PK2V3L~2ak5a6lGINCPHeIjUZiRQ21eCpihWCgKYAFODVpfHkRdTFSdzLSS5hd9GbujTFAvMUMGSiWdgl2f2izMQ7xBdDEg5YPJ7CNaaLQesAPY4SPnHaFfA-QBj6SjUjfWa1ei~GVPu8Sin~JRH~NhwsjrAFY5NfGE-1AkregqTMu6N1carPYtWuegI8IuLL85-fWL2YeaI~9uoVrSzTb1bWNNjcLpyFRjvxjE884b561Q3Q70VVuQsRh4Uqw4yOqApkWeurd867LXHkxOrherrh1SNkqy6sZfw__"
                                            }
                                            alt="country"
                                        />
                                    </div>
                                    <div className="rounded-full overflow-hidden col-span-2 row-span-2 aspect-square">
                                        <Image
                                            width={128}
                                            height={128}
                                            className=" object-cover"
                                            src={
                                                "https://s3-alpha-sig.figma.com/img/6e24/4a4c/7303f08d0e5256baac6d7c2079772198?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ErHFqB6ixATqqLXwAKZWzs42ikMOii19TadXAUBQcG0Zb4Mhi~PK2V3L~2ak5a6lGINCPHeIjUZiRQ21eCpihWCgKYAFODVpfHkRdTFSdzLSS5hd9GbujTFAvMUMGSiWdgl2f2izMQ7xBdDEg5YPJ7CNaaLQesAPY4SPnHaFfA-QBj6SjUjfWa1ei~GVPu8Sin~JRH~NhwsjrAFY5NfGE-1AkregqTMu6N1carPYtWuegI8IuLL85-fWL2YeaI~9uoVrSzTb1bWNNjcLpyFRjvxjE884b561Q3Q70VVuQsRh4Uqw4yOqApkWeurd867LXHkxOrherrh1SNkqy6sZfw__"
                                            }
                                            alt="country"
                                        />
                                    </div>
                                    <div className="rounded-full overflow-hidden col-span-2 row-span-2 aspect-square">
                                        <Image
                                            width={128}
                                            height={128}
                                            className=" object-cover"
                                            src={
                                                "https://s3-alpha-sig.figma.com/img/6e24/4a4c/7303f08d0e5256baac6d7c2079772198?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ErHFqB6ixATqqLXwAKZWzs42ikMOii19TadXAUBQcG0Zb4Mhi~PK2V3L~2ak5a6lGINCPHeIjUZiRQ21eCpihWCgKYAFODVpfHkRdTFSdzLSS5hd9GbujTFAvMUMGSiWdgl2f2izMQ7xBdDEg5YPJ7CNaaLQesAPY4SPnHaFfA-QBj6SjUjfWa1ei~GVPu8Sin~JRH~NhwsjrAFY5NfGE-1AkregqTMu6N1carPYtWuegI8IuLL85-fWL2YeaI~9uoVrSzTb1bWNNjcLpyFRjvxjE884b561Q3Q70VVuQsRh4Uqw4yOqApkWeurd867LXHkxOrherrh1SNkqy6sZfw__"
                                            }
                                            alt="country"
                                        />
                                    </div>
                                    <div className="rounded-full overflow-hidden col-span-2 row-span-2 aspect-square">
                                        <Image
                                            width={128}
                                            height={128}
                                            className=" object-cover"
                                            src={
                                                "https://s3-alpha-sig.figma.com/img/6e24/4a4c/7303f08d0e5256baac6d7c2079772198?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ErHFqB6ixATqqLXwAKZWzs42ikMOii19TadXAUBQcG0Zb4Mhi~PK2V3L~2ak5a6lGINCPHeIjUZiRQ21eCpihWCgKYAFODVpfHkRdTFSdzLSS5hd9GbujTFAvMUMGSiWdgl2f2izMQ7xBdDEg5YPJ7CNaaLQesAPY4SPnHaFfA-QBj6SjUjfWa1ei~GVPu8Sin~JRH~NhwsjrAFY5NfGE-1AkregqTMu6N1carPYtWuegI8IuLL85-fWL2YeaI~9uoVrSzTb1bWNNjcLpyFRjvxjE884b561Q3Q70VVuQsRh4Uqw4yOqApkWeurd867LXHkxOrherrh1SNkqy6sZfw__"
                                            }
                                            alt="country"
                                        />
                                    </div>
                                </div>
                                <div className=" grid grid-cols-8 gap-2">
                                    <div className=" col-span-1 row-span-2 aspect-square"></div>
                                    <div className="rounded-full overflow-hidden col-span-2 row-span-2 aspect-square">
                                        <Image
                                            width={128}
                                            height={128}
                                            className=" object-cover"
                                            src={
                                                "https://s3-alpha-sig.figma.com/img/6e24/4a4c/7303f08d0e5256baac6d7c2079772198?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ErHFqB6ixATqqLXwAKZWzs42ikMOii19TadXAUBQcG0Zb4Mhi~PK2V3L~2ak5a6lGINCPHeIjUZiRQ21eCpihWCgKYAFODVpfHkRdTFSdzLSS5hd9GbujTFAvMUMGSiWdgl2f2izMQ7xBdDEg5YPJ7CNaaLQesAPY4SPnHaFfA-QBj6SjUjfWa1ei~GVPu8Sin~JRH~NhwsjrAFY5NfGE-1AkregqTMu6N1carPYtWuegI8IuLL85-fWL2YeaI~9uoVrSzTb1bWNNjcLpyFRjvxjE884b561Q3Q70VVuQsRh4Uqw4yOqApkWeurd867LXHkxOrherrh1SNkqy6sZfw__"
                                            }
                                            alt="country"
                                        />
                                    </div>
                                    <div className="rounded-full overflow-hidden col-span-2 row-span-2 aspect-square">
                                        <Image
                                            width={128}
                                            height={128}
                                            className=" object-cover"
                                            src={
                                                "https://s3-alpha-sig.figma.com/img/6e24/4a4c/7303f08d0e5256baac6d7c2079772198?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ErHFqB6ixATqqLXwAKZWzs42ikMOii19TadXAUBQcG0Zb4Mhi~PK2V3L~2ak5a6lGINCPHeIjUZiRQ21eCpihWCgKYAFODVpfHkRdTFSdzLSS5hd9GbujTFAvMUMGSiWdgl2f2izMQ7xBdDEg5YPJ7CNaaLQesAPY4SPnHaFfA-QBj6SjUjfWa1ei~GVPu8Sin~JRH~NhwsjrAFY5NfGE-1AkregqTMu6N1carPYtWuegI8IuLL85-fWL2YeaI~9uoVrSzTb1bWNNjcLpyFRjvxjE884b561Q3Q70VVuQsRh4Uqw4yOqApkWeurd867LXHkxOrherrh1SNkqy6sZfw__"
                                            }
                                            alt="country"
                                        />
                                    </div>
                                    <div className="rounded-full overflow-hidden col-span-2 row-span-2 aspect-square">
                                        <Image
                                            width={128}
                                            height={128}
                                            className=" object-cover"
                                            src={
                                                "https://s3-alpha-sig.figma.com/img/6e24/4a4c/7303f08d0e5256baac6d7c2079772198?Expires=1716163200&Key-Pair-Id=APKAQ4GOSFWCVNEHN3O4&Signature=ErHFqB6ixATqqLXwAKZWzs42ikMOii19TadXAUBQcG0Zb4Mhi~PK2V3L~2ak5a6lGINCPHeIjUZiRQ21eCpihWCgKYAFODVpfHkRdTFSdzLSS5hd9GbujTFAvMUMGSiWdgl2f2izMQ7xBdDEg5YPJ7CNaaLQesAPY4SPnHaFfA-QBj6SjUjfWa1ei~GVPu8Sin~JRH~NhwsjrAFY5NfGE-1AkregqTMu6N1carPYtWuegI8IuLL85-fWL2YeaI~9uoVrSzTb1bWNNjcLpyFRjvxjE884b561Q3Q70VVuQsRh4Uqw4yOqApkWeurd867LXHkxOrherrh1SNkqy6sZfw__"
                                            }
                                            alt="country"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CarouselItem>
                    <CarouselItem className="w-full h-dvh flex flex-col justify-center items-center">
                        <div className="p-5">
                            <Button
                                onClick={() => {
                                    router.push("/esims");
                                }}
                            >
                                Continue
                            </Button>
                        </div>
                    </CarouselItem>
                </CarouselContent>
            </Carousel>
        </main>
    );
}
