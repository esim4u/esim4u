import { Button } from "@/components/ui/button";
import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { useMemo, useState } from "react";
import { useGetCountryPackages } from "../hooks/use-packages";
import CustomInput from "@/components/ui/custom-input";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { l } from "@/features/locale/lib/locale";
import { COUNTRIES } from "@/constants";
import { searchInCoverage } from "../lib/utils";
import { highlightMatches } from "@/lib/utils";
import ReactCountryFlag from "react-country-flag";

const PackageCoverageDrawer = ({ country_code }: { country_code: string }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState("");
	const { data: countryPackages } = useGetCountryPackages(country_code);

	const filteredCoverage = useMemo(() => {
		const coverage = countryPackages?.operators[0].coverages || [];
		return searchInCoverage({ coverage, search });
	}, [search, countryPackages?.operators[0].coverages]);

	return (
		<Drawer open={isOpen} onOpenChange={setIsOpen}>
			<DrawerTrigger asChild>
				<Button size={"fit"} className=" capitalize" variant={"link"}>
					{countryPackages.operators[0].coverages.length}{" "}
					{l("text_countries")}
				</Button>
			</DrawerTrigger>
			<DrawerContent className=" container">
				<div className="mx-auto w-full max-w-sm">
					<DrawerHeader>
						<DrawerTitle className="text-center">
							{"Country coverage"}
						</DrawerTitle>
						<DrawerDescription className="mx-auto">
							{"Find supported countries for this package"}
						</DrawerDescription>
					</DrawerHeader>
					<DrawerBody className="flex justify-center w-full items-center p-0">
						<div className="w-full">
							<CustomInput
								icon={HiMiniMagnifyingGlass}
								value={search}
								setValue={setSearch}
								placeholder="Search countries or networks"
							/>
						</div>
						<div className="flex flex-col gap-2 w-full h-[60vh] overflow-y-auto no-scrollbar">
							{filteredCoverage.map(
								(country: any, index: number) => {
									return (
										<PackageCoverageItem
											key={index}
											country={country}
											search={search}
										/>
									);
								}
							)}
						</div>
					</DrawerBody>
				</div>
			</DrawerContent>
		</Drawer>
	);
};

export default PackageCoverageDrawer;

const PackageCoverageItem = ({
	country,
	search = "",
}: {
	country: any;
	search?: string;
}) => {
	return (
		<div className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-white p-2 transition-transform active:scale-95">
			<div className="flex flex-row items-center  gap-4">
				<ReactCountryFlag
					countryCode={country?.name}
					className="rounded-md drop-shadow-sm"
					style={{
						width: "34px",
						height: "26px",
					}}
					svg
				/>
				<span className="text-balance text-sm font-semibold uppercase leading-4">
					{highlightMatches(search, country.fullName)}
				</span>
			</div>
		</div>
	);
};
