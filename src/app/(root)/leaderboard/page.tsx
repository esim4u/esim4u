import LeaderBoard from "@/screens/leaderboard";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "LeaderBoard",
    description: "Esim4U LeaderBoard Page",
};

export default function LeaderBoardPage() {
    return <LeaderBoard />;
}
