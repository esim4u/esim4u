import Donation from "@/screens/payment/donation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Donation",
    description: "Esim4U Donation Page",
};

export default function DonationPage() {
    return <Donation />;
}
