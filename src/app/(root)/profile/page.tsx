import Loader from "@/components/ui/loader";
import Profile from "@/screens/user/profile";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
    title: "Profile",
    description: "Users Profile Page",
};

export default function ProfilePage() {
    return (
        <Suspense
            fallback={
                <div className="flex h-full w-full items-center justify-center">
                    <Loader />
                </div>
            }
        >
            <Profile />;
        </Suspense>
    );
}
