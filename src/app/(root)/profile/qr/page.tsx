import QrScreen from "@/screens/qr-screen";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Qr Page",
    description: "Page where users can scan their ref qr code",
};

const QrPage = () => {
    return <QrScreen />;
};

export default QrPage;
