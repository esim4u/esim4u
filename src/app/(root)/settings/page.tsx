import Settings from "@/screens/settings";
import { Metadata } from "next";


export const metadata: Metadata = {
    title: "Settings",
    description: "Esim4U Settings Page",
};


export default function SettingsPage() {
    return <Settings />;
}
