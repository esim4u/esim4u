import History from "@/screens/user/history";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "History",
    description: "Users Esims History Page",
};

export default function HistoryPage() {
    return <History />;
}
