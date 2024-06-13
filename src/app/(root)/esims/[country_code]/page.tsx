import { COUNTRIES } from "@/constants";
import Package from "@/screens/package/package";
import { Metadata } from "next";

type Props = {
    params: { country_code: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const country =
        params.country_code in COUNTRIES
            ? COUNTRIES[params.country_code as keyof typeof COUNTRIES]
            : params.country_code;

    return {
        title: `Packages for ${country}`,
    };
}

const EsimPackagePage = ({ params }: Props) => {
    return <Package params={params} />;
};

export default EsimPackagePage;
