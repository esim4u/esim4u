import { Metadata } from "next";

import dynamic from "next/dynamic";
const Profile = dynamic(() => import("@/screens/profile"), { ssr: false });

export const metadata: Metadata = {
    title: "Profile",
    description: "Users Profile Page",
};

export default function ProfilePage() {
    return <Profile />;
}
