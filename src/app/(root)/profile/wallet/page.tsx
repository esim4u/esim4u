import Wallet from "@/screens/user/wallet";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Wallet Page",
    description: "Page where user can view their wallet details",
};

const WalletPage = () => {
    return <Wallet />;
};

export default WalletPage;
