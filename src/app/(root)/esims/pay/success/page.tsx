import Success from "@/screens/payment/success";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Success page",
    description: "Esim4U Success Page",
};

export default function SuccessPage() {
    return <Success />;
}
