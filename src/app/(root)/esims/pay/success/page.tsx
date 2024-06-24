import { Suspense } from "react";
import Success from "@/screens/payment/success";

export default function SuccessPage() {
    return (
        <Suspense>
            <Success />
        </Suspense>
    );
}
