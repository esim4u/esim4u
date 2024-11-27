import { Suspense } from "react";
import Settings from "@/screens/user/settings";

export default function SettingsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Settings />;
        </Suspense>
    );
}
