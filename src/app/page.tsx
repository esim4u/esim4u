"use client";

import Loader from "@/components/ui/loader";
import { setLanguage } from "@/lib/locale";
import { useTelegram } from "@/providers/telegram-provider";
import { getUserById, updateUser } from "@/services/supabase";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function IndexPage() {
    const router = useRouter();
    const { user: tgUser, webApp } = useTelegram();

    const fetchUser = async (id: number | string) => {
        const dbUser = await getUserById(id);

        if (dbUser?.id) {
            await updateUser(tgUser, dbUser);
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
            <Loader />
        </main>
    );
}
