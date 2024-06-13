import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
    title: "Donation",
    description: "Esim4U Donation Page",
};
const Donation = dynamic(() => import("@/screens/payment/donation"), {
    ssr: false,
});
export default function DonationPage() {
    return <Donation />;
}
