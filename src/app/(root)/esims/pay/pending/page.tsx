import { Metadata } from "next";
import Pending from "@/screens/payment/pending";
import { Suspense } from "react";
import Loader from "@/components/ui/loader";

export const metadata: Metadata = {
    title: "Pending page",
    description: "Esim4U Pending Page",
};

export default function PendingPage() {
    return (
        <Suspense
            fallback={
                <main className="flex h-dvh flex-col items-center justify-center overflow-x-hidden ">
                    <div className="flex flex-col items-center gap-4">
                        <Loader />
                    </div>
                </main>
            }
        >
            <Pending />
        </Suspense>
    );
}
