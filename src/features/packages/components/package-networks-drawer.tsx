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
import { highlightMatches } from "@/lib/utils";
import React, { useMemo, useState } from "react";
import { useGetPackageNetworks } from "../hooks/use-packages";
import CustomInput from "@/components/ui/custom-input";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import { searchInNetworks } from "../lib/utils";
import ReactCountryFlag from "react-country-flag";
import { COUNTRIES } from "@/constants";

const PackageNetworksDrawer = ({ package_id }: { package_id: string }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState("");
	const { data: networks, isPending } = useGetPackageNetworks(
		package_id,
		isOpen
	);

	const filteredNetworks = useMemo(() => {
		if (!networks) return [];
		return searchInNetworks({
			networks,
			search,
		});
	}, [networks, search]);

	return (
		<Drawer open={isOpen} onOpenChange={setIsOpen}>
			<DrawerTrigger asChild>
				<Button className="h-4" variant={"link"}>
					Networks
				</Button>
			</DrawerTrigger>
			<DrawerContent className="min-h-[80dvh] container">
				<div className="mx-auto w-full max-w-sm">
					<DrawerHeader>
						<DrawerTitle className="text-center">
							{"Networks"}
						</DrawerTitle>
						<DrawerDescription className="mx-auto">
							{"Find the networks available for this package"}
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
							{filteredNetworks?.map(
								(network: any, index: number) => (
									<PackageNetworkItem
										key={index}
										network={network}
										search={search}
									/>
								)
							)}
						</div>
					</DrawerBody>
				</div>
			</DrawerContent>
		</Drawer>
	);
};

export default PackageNetworksDrawer;

const PackageNetworkItem = ({
	network,
	search = "",
}: {
	network: any;
	search?: string;
}) => {
	return (
		<div className="flex w-full items-center justify-between rounded-xl bg-white p-2">
			<div className="  flex items-center gap-1 w-2/5">
				<ReactCountryFlag
					countryCode={network.name}
					svg
					style={{
						width: "2.25em",
						height: "1.6em",
					}}
					className="overflow-hidden rounded-md object-cover drop-shadow-sm"
				/>
				<h2 className=" text-base font-semibold leading-5 truncate">
					{highlightMatches(
						search,
						COUNTRIES[network.name.toLowerCase()] || network.name
					)}
				</h2>
			</div>

			<div className="flex w-3/5 flex-wrap content-end justify-end gap-1 overflow-hidden">
				{network.networks.map((n: any, index: number) => (
					<div
						key={index}
						className=" rounded-sm border-2 border-black px-2 text-sm"
					>
						<h2 className=" truncate max-w-36">
							{highlightMatches(search, n.name)}({n.types})
						</h2>
					</div>
				))}
			</div>
		</div>
	);
};
