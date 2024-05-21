"use client";

import BounceLoader from "@/components/ui/bounce-loader";
import { useTelegram } from "@/providers/telegram-provider";
import { getUserById, updateUser } from "@/services/supabase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();

    const fetchUser = async (id: number | string) => {
        const dbUser = await getUserById(id);

        if (dbUser?.id) {
            await updateUser(tgUser, dbUser, webApp.platform);
            return router.push("/esims");
        }

        return router.push("/onboarding");
    };

    useEffect(() => {
        if (tgUser && webApp) {
            fetchUser(tgUser.id);
        }
    }, [tgUser]);

    return (
        <main className="overflow-x-hidden h-dvh flex flex-col justify-center items-center ">
            <BounceLoader />
        </main>
    );
}
