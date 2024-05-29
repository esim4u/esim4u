"use client";

import { l } from "@/lib/locale";
import { cn, hapticFeedback } from "@/lib/utils";
import { useTelegram } from "@/providers/telegram-provider";
import { getUserReferrals } from "@/services/supabase";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { BiPurchaseTagAlt } from "react-icons/bi";

const Referrals = () => {
    const { user: tgUser, webApp } = useTelegram();

    const { data: referrals, isLoading } = useQuery({
        queryKey: ["referrals", tgUser?.id],
        queryFn: async () => {
            const data = await getUserReferrals(tgUser.id);
            return data;
        },
        placeholderData: keepPreviousData,
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 60, // 1 hour
    });

    if (referrals?.length === 0) {
        return (
            <div className=" w-full">
                <div className="relative flex flex-col items-center justify-center gap-2 bg-white rounded-3xl h-[180px] w-full">
                    <div
                        className={cn(
                            "absolute left-4 top-4 flex  gap-2 uppercase items-center font-medium text-neutral-500"
                        )}
                    >
                        <h2>{l("title_frens")}</h2>{" "}
                    </div>
                    <div className="flex flex-col gap-2 mt-1 items-center justify-center">
                        <h2 className="text-center font-medium text-3xl text-neutral-300">
                            NO FRENS YET
                        </h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex  gap-2 uppercase justify-between items-center px-4 font-medium text-neutral-500">
                <h2 className="">{l("title_frens")}</h2>
                <div className="bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center text-center text-white rounded-full font-bold size-6">
                    <span className="">{referrals?.length}</span>
                </div>
            </div>

            {referrals?.map((referral, index) => (
                <div
                    key={referral.telegram_id}
                    onClick={() => {
                        hapticFeedback();
                        webApp?.openTelegramLink(
                            "https://t.me/" + referral.username
                        );
                    }}
                    className="flex items-center justify-between bg-white h-10 p-4 rounded-2xl"
                >
                    <span className="text-blue-500 font-medium">
                        @{referral.username}
                    </span>
                    <div className=" grid grid-cols-5 gap-1 w-40 ">
                        <div className=" col-span-2 flex items-center justify-center -mr-4">
                            <span className="  flex items-center min-w-9 px-1 justify-center  font-medium bg-gradient-to-r from-violet-500 to-purple-500 text-white rounded-md">
                                {index == 1 ? 12 : 213}
                            </span>
                        </div>
                        <div className="col-span-2  flex items-center justify-center">
                            <span className=" flex items-center text-purple-500 font-semibold">
                                {index == 1 ? 0.5 : 12.5}
                                <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clipPath="url(#clip0_2028_1457)">
                                        <path
                                            d="M20.1036 -0.000366211H3.89546C0.91535 -0.000366211 -0.973515 3.21428 0.525777 5.81304L10.5289 23.1512C11.1816 24.2833 12.8175 24.2833 13.4702 23.1512L23.4753 5.81304C24.9726 3.21843 23.0837 -0.000366211 20.1057 -0.000366211H20.1036ZM10.5207 17.9517L8.34222 13.7355L3.08571 4.33417C2.73894 3.73244 3.16725 2.96135 3.89342 2.96135H10.5187V17.9538L10.5207 17.9517ZM20.9093 4.33214L15.6548 13.7376L13.4763 17.9517V2.95931H20.1016C20.8278 2.95931 21.2561 3.7304 20.9093 4.33214Z"
                                            fill="currentColor"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_2028_1457">
                                            <rect
                                                width="24"
                                                height="24"
                                                fill="white"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </span>
                        </div>

                        <div className="col-span-1  flex items-center justify-center">
                            {referral.is_premium && (
                                <svg
                                    width="24"
                                    height="25"
                                    viewBox="0 0 24 25"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="-mt-1"
                                >
                                    <path
                                        d="M10.7327 3.20006C11.2365 2.12653 12.7635 2.12653 13.2673 3.20006L15.3908 7.72406C15.5892 8.14669 15.9852 8.44263 16.4467 8.51314L21.3067 9.25568C22.4331 9.42778 22.8931 10.8017 22.0973 11.6173L18.4934 15.311C18.1831 15.629 18.0422 16.0755 18.1138 16.5141L18.9523 21.6546C19.1404 22.808 17.916 23.6706 16.8932 23.1052L12.6773 20.7747C12.2558 20.5417 11.7442 20.5417 11.3227 20.7747L7.10678 23.1052C6.08399 23.6706 4.85959 22.808 5.04774 21.6546L5.27904 20.2366C5.28754 20.1845 5.29858 20.1341 5.31398 20.0836C5.44315 19.66 6.13321 17.5494 7.3 16.7C9.04138 15.6036 11.3394 14.3618 12.7517 13.6182C12.9574 13.5099 12.843 13.1784 12.6144 13.2204C10.701 13.5721 7.35506 14.1458 5.74836 14.174C5.66736 14.1754 5.58911 14.169 5.51015 14.1509C4.5003 13.9197 3.31538 12.9971 3.05311 12.7854C3.01695 12.7562 2.98374 12.7253 2.95129 12.692L1.90271 11.6173C1.10693 10.8017 1.56688 9.42778 2.69332 9.25568L7.55332 8.51314C8.01484 8.44263 8.41084 8.14669 8.60921 7.72405L10.7327 3.20006Z"
                                        fill="url(#paint0_linear_2001_2374)"
                                    />
                                    <defs>
                                        <linearGradient
                                            id="paint0_linear_2001_2374"
                                            x1="19.7028"
                                            y1="2.84722"
                                            x2="3.92006"
                                            y2="21.9779"
                                            gradientUnits="userSpaceOnUse"
                                        >
                                            <stop stop-color="#DB75E4" />
                                            <stop
                                                offset="1"
                                                stop-color="#6C6AD2"
                                            />
                                        </linearGradient>
                                    </defs>
                                </svg>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default Referrals;
