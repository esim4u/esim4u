"use client";

import BounceLoader from "@/components/ui/bounce-loader";
import { useTelegram } from "@/providers/telegram-provider";
import { useQuery } from "@tanstack/react-query";
import { getUserById, updateUser } from "@/services/supabase";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();

    const fetchUser = async (id: number | string) => {
        const user = await getUserById(id);

        if (user?.id) {
            await updateUser(user)
            return router.push("/esims");
        }

        return router.push("/welcome");
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
