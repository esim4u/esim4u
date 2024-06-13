import Pending from "@/screens/payment/pending";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Pending page",
    description: "Esim4U Pending Page",
};

export default function PendingPage() {
    return <Pending />;
}
