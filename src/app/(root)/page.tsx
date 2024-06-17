"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTelegram } from "@/providers/telegram-provider";
import { getUserById, updateUser } from "@/services/supabase";

import Loader from "@/components/ui/loader";

export default function IndexPage() {
    const router = useRouter();
    // const searchParams = useSearchParams();
    // const newsletter = searchParams.get("newsletter");

    const { user: tgUser, webApp, start_param } = useTelegram();

    const fetchUser = async (id: number | string) => {
        const dbUser = await getUserById(id);

        if (dbUser?.id) {
            // if (newsletter) {
            //     const res = await updateUserActivity({
            //         telegram_id: tgUser.id,
            //         newsletter_id: newsletter,
            //         story_id: null,
            //     });
            //     await sendTgLog(`User ${tgUser.id} checked to newsletter ${newsletter}`);
            // }
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
