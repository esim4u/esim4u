"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getUserById, getWalletByUserId } from "@/services/supabase";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { IoIosSettings } from "react-icons/io";
import { IoQrCode } from "react-icons/io5";

import { cn } from "@/lib/utils";
import { useTelegram } from "@/hooks/use-telegram";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import UserEsims from "@/components/esims/user-esims";
import { TonIcon, WalletIcon } from "@/components/icons";
import Achievements from "@/components/shared/achievements";
import RefLinkButton from "@/components/shared/ref-link-button";
import SupportProjectButton from "@/components/shared/support-project-button";

export default function Profile() {
    const router = useRouter();
    const { tgUser } = useTelegram();
    const searchParams = useSearchParams();
    const is_payment = searchParams.get("is_payment") || false;

    const { data: dbUserData, isLoading } = useQuery({
        queryKey: ["user", tgUser?.id],
        queryFn: async () => {
            const data = await getUserById(tgUser?.id);
            return data;
        },
        placeholderData: keepPreviousData,
    });

    return (
        <main className="no-scrollbar flex h-dvh flex-col items-center overflow-x-hidden px-5 py-2">
            <div className="relative flex w-full flex-col items-center gap-4">
                <IoIosSettings
                    onClick={() => {
                        router.push("/settings");
                    }}
                    className="absolute left-0 top-8 h-12 w-12 cursor-pointer text-neutral-400"
                />
                <WalletBanner className="absolute -right-5 top-8" />

                <div className="flex flex-col items-center gap-2">
                    <Avatar className="h-32 w-32  ring-[3px] ring-neutral-400/30 ring-offset-2">
                        <AvatarImage
                            src={
                                tgUser?.photoUrl ||
                                dbUserData?.photo_url ||
                                "/img/default-user.png"
                            }
                            alt="@shadcn"
                        />
                        <AvatarFallback className=" bg-neutral-500 text-white">
                            {tgUser?.firstName && tgUser?.firstName[0]}
                        </AvatarFallback>
                    </Avatar>
                    <h2 className=" text-center font-medium leading-3 text-neutral-500">
                        {tgUser?.username ? `@${tgUser?.username}` : "@user"}
                    </h2>
                    <Badge size={"md"}>{dbUserData?.badge}</Badge>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <RefLinkButton />

                    <button className=" flex h-10 w-10 items-center justify-center rounded-full bg-white active:scale-90">
                        <IoQrCode
                            onClick={() => {
                                router.push("/profile/qr");
                            }}
                            className=" h-7 w-7 cursor-pointer py-1 text-neutral-400"
                        />
                    </button>
                </div>
                <Achievements fullWidth />
                <Suspense fallback={<div></div>}>
                    <UserEsims />
                </Suspense>

                {/* <Referrals /> */}
                <SupportProjectButton />
            </div>
        </main>
    );
}

const WalletBanner = ({ className }: { className?: string }) => {
    const router = useRouter();
    const { tgUser } = useTelegram();

    const { data: walletData } = useQuery({
        queryKey: ["wallet", tgUser?.id],
        queryFn: async () => {
            const data = await getWalletByUserId(tgUser?.id);
            return data;
        },
        placeholderData: keepPreviousData,
        refetchInterval: 1000 * 10, // 10 sec
    });

    return (
        <button
            onClick={() => {
                router.push("/profile/wallet");
            }}
            className={cn(
                "flex  origin-right flex-row items-center justify-center gap-2 rounded-l-2xl bg-white px-3 py-1.5 shadow-lg shadow-black/5 active:scale-95",
                className,
            )}
        >
            <WalletIcon className={" h-9 w-9 text-tgaccent"} />
            <div className="flex items-center justify-center text-tgaccent">
                <span className="text-[22px]  font-bold">
                    {walletData?.amount}
                </span>
                <TonIcon className="h-4 w-4" />
            </div>
        </button>
    );
};
