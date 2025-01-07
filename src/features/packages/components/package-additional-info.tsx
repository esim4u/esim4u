"use client";

import { COUNTRIES } from "@/constants";
import CompatibleDevicesDrawer from "@/features/esims/components/compatible-devices-drawer";
import { l } from "@/features/locale/lib/locale";
import { usePathname, useRouter } from "next/navigation";
import PackageCoverageDrawer from "./package-coverage-drawer";

const PackageAdditionalInfo = ({
	packageData,
	country_code,
}: {
	packageData: any;
	country_code: string;
}) => {
	if (!packageData) return null;
	return (
		<div className=" flex flex-col gap-2 rounded-2xl bg-white  p-5 shadow-md">
			<h2 className="pl-1 text-xs font-medium uppercase text-neutral-500">
				{l("title_information")}
			</h2>

			<div className="flex flex-col gap-2">
				<div className="flex flex-row items-center justify-between">
					<h3 className="text-sm font-bold capitalize">
						{l("label_coverage")}
					</h3>
					{packageData.operators[0].coverages.length > 1 ? (
						<PackageCoverageDrawer country_code={country_code} />
					) : (
						<h3 className="text-sm font-bold">
							{COUNTRIES[
								packageData.operators[0].coverages[0].name.toLowerCase()
							] || packageData.operators[0].coverages[0].name}
						</h3>
					)}
				</div>
				<div className="flex flex-row items-center justify-between">
					<h3 className="text-sm font-bold capitalize">
						{l("label_plan")}
					</h3>
					<h3 className="text-sm font-bold capitalize">
						{packageData.operators[0].plan_type && l("text_plan")}
					</h3>
				</div>
				<div className="flex flex-row items-center justify-between">
					<h3 className="text-sm font-bold capitalize">
						{l("label_top_up")}
					</h3>
					<h3 className="text-sm font-bold capitalize">
						{packageData.operators[0].rechargeability
							? l("text_top_up")
							: "Not available"}
					</h3>
				</div>
				<div className="flex flex-row items-center justify-between">
					<h3 className="text-sm font-bold capitalize">
						{l("label_compatible_devices")}
					</h3>
					<CompatibleDevicesDrawer />
				</div>
			</div>
		</div>
	);
};

export default PackageAdditionalInfo;
