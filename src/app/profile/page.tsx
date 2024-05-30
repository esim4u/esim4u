import Profile from "@/screens/profile";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profile",
    description: "Users Profile Page",
};

export default function ProfilePage() {
    return <Profile />;
}
