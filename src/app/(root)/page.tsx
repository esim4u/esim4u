"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserById, updateUser } from "@/services/supabase";

import Loader from "@/components/ui/loader";
import { initData, useLaunchParams, useSignal } from "@telegram-apps/sdk-react";

export default function IndexPage() {
    const router = useRouter();
    const initDataState = useSignal(initData.state);
	const lp = useLaunchParams();



    useEffect(() => {
        const fetchUser = async (tgUser: any) => {
            const dbUser = await getUserById(tgUser.id);
    
            if (dbUser?.id) {
                await updateUser(tgUser, dbUser);
                return router.push("/esims");
            }
    
            return router.push("/onboarding");
        };

        if (initDataState && lp) {
            const tgUser = {
                ...initDataState.user,
                start_param: initData.startParam,
                platform: lp?.platform,
            }
            fetchUser(tgUser.id);
        }
    }, [initDataState, lp, router]);



    return (
        <main className="container flex h-screen items-center justify-center bg-white py-5">
            <Loader />
        </main>
    );
}
