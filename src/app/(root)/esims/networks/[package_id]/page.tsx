import Networks from "@/screens/package/networks";
import { Metadata } from "next";

type Props = {
    params: { package_id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    return {
        title: `Networks for ${params.package_id}`,
    };
}

const NetwokrsPage = ({ params }: Props) => {
    return <Networks params={params} />;
};

export default NetwokrsPage;
