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
import { cn } from "@/lib/utils";
import React, { useMemo, useState } from "react";
import { useGetPackageNetworks } from "../hooks/use-packages";
import CustomInput from "@/components/ui/custom-input";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";
import PackageNetworkItem from "./package-network-item";
import { searchInNetworks } from "../lib/utils";

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
