"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Esim } from "@/types";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { RiHistoryFill, RiSimCard2Fill } from "react-icons/ri";

import { l } from "@/lib/locale";
import { cn } from "@/lib/utils";
import { useTelegram } from "@/hooks/use-telegram";

import { Skeleton } from "../ui/skeleton";
import EsimCard from "./esim-card";

type Props = {};

const UserEsims = (props: Props) => {
    const { tgUser } = useTelegram();
    const router = useRouter();

    const searchParams = useSearchParams();
    const iccid = searchParams.get("iccid");

    const { data: userEsims, isLoading } = useQuery({
        queryKey: ["user-esims", tgUser?.id],
        queryFn: async () => {
            const data = await axios.get(`/api/user/${tgUser?.id}/esims`);
            return data.data;
        },
        placeholderData: keepPreviousData,
        enabled: !!tgUser?.id,
        refetchInterval: 1000 * 60 * 1, // 1 minutes
    });

    if (!userEsims && isLoading) {
        return (
            <div className="flex w-full flex-col gap-2">
                <div className="flex items-center  gap-2 pl-4 font-medium uppercase text-neutral-500">
                    <h2>{l("title_esims")}</h2>
                </div>
                <div className="flex w-full flex-col gap-5">
                    {Array(2)
                        .fill(null)
                        .map((_, index) => (
                            <Skeleton
                                className="h-36 w-full rounded-2xl"
                                key={index}
                            />
                        ))}
                </div>
            </div>
        );
    }

    if (!userEsims) {
        return (
            <div className=" w-full">
                <div className="relative flex h-[180px] w-full flex-col items-center justify-center gap-2 rounded-3xl bg-white">
                    <div
                        className={cn(
                            "absolute left-4 top-4 flex  items-center gap-2 font-medium uppercase text-neutral-500",
                        )}
                    >
                        <h2>{l("title_esims")}</h2>{" "}
                    </div>
                    <div className="mt-1 flex flex-col items-center justify-center gap-2">
                        <RiSimCard2Fill className=" size-[52px]  -scale-x-100 text-neutral-300/75 " />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex w-full flex-col gap-2">
            <div className="flex items-center  justify-between gap-2 px-4 font-medium uppercase text-neutral-500">
                <h2>{l("title_esims")}</h2>{" "}
                <h2
                    onClick={() => {
                        router.push("/profile/history");
                    }}
                    className="flex cursor-pointer underline underline-offset-4 active:scale-95 active:bg-white/50"
                >
                    <RiHistoryFill className="h-6 w-6" />
                    {/* {l("title_history")} */}
                </h2>
            </div>
            <div className="flex w-full flex-col gap-5">
                {userEsims?.map((esim: Esim) => (
                    <EsimCard
                        key={esim.iccid}
                        package_id={esim.package_id}
                        iccid={esim.iccid}
                        state={esim.state}
                        coverage={esim.coverage}
                        image_url={esim.image_url}
                        validity={esim.validity}
                        data={esim.data}
                        sm_dp={esim.sm_dp}
                        confirmation_code={esim.confirmation_code}
                        type={esim.type}
                        usage={esim.usage}
                        expired_at={esim.expired_at}
                        available_topups={esim.available_topups}
                        open_iccid={iccid || ""}
                    />
                ))}
            </div>
        </div>
    );
};

export default UserEsims;
