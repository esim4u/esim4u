import OnBoarding from "@/screens/onboarding";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "OnBoarding",
    description: "Esim4U OnBoarding Page",
};

export default function OnBoardingPage() {
    return <OnBoarding />;
}
