import { COUNTRIES } from "@/constants";
import PackageCoverage from "@/screens/package/coverage";
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
        title: `Coverage for ${country} package`,
    };
}

const PackageCoveragePage = ({ params }: Props) => {
    return <PackageCoverage params={params} />;
};

export default PackageCoveragePage;
