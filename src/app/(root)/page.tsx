"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTelegram } from "@/providers/telegram-provider";
import {
    getUserById,
    updateUser,
    updateUserActivity,
} from "@/services/supabase";

import Loader from "@/components/ui/loader";

export default function IndexPage() {
    const router = useRouter();
    const { user: tgUser, webApp, start_param } = useTelegram();

    const fetchUser = async (id: number | string) => {
        const dbUser = await getUserById(id);

        if (dbUser?.id) {
            if (
                start_param &&
                start_param.toString().startsWith("newsletter=")
            ) {
                const match = start_param.toString().split("newsletter=")[1];
                const res = await updateUserActivity({
                    telegram_id: tgUser.id,
                    newsletter_id: match,
                    story_id: null,
                });
            }
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
        <main className="flex h-dvh flex-col items-center justify-center overflow-x-hidden ">
            <Loader />
        </main>
    );
}
