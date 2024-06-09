import Profile from "@/screens/profile";
import { Metadata } from "next";
import { Suspense } from 'react'

export const metadata: Metadata = {
    title: "Profile",
    description: "Users Profile Page",
};


export default function ProfilePage() {
    return
    <Suspense fallback={<></>}>
        <Profile/>;

    </Suspense>
}
