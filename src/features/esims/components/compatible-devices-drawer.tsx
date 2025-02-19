import {
	Drawer,
	DrawerBody,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";
import CustomInput from "@/components/ui/custom-input";
import { HiMiniMagnifyingGlass } from "react-icons/hi2";

import { l } from "@/features/locale/lib/locale";
import { useGetEsimCompatibleDevices } from "../hooks/use-esims";
import { groupDevicesByBrand, searchInGroupedDevices } from "../lib/utils";
import { highlightMatches } from "@/lib/utils";

const CompatibleDevicesDrawer = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [search, setSearch] = useState("");

	const { data: devices } = useGetEsimCompatibleDevices();

	const filteredDevices = useMemo(() => {
		if (!devices) return [];

		const groupedDevices = groupDevicesByBrand(devices);
		return searchInGroupedDevices(groupedDevices, search);
	}, [devices, search]);

	return (
		<Drawer open={isOpen} onOpenChange={setIsOpen}>
			<DrawerTrigger asChild>
				<Button size={"fit"} className=" capitalize" variant={"link"}>
					{l("text_compatible_devices")}
				</Button>
			</DrawerTrigger>
			<DrawerContent className="min-h-[80dvh] container">
				<div className="mx-auto w-full max-w-sm">
					<DrawerHeader>
						<DrawerTitle className="text-center">
							{"Compatible Devices"}
						</DrawerTitle>
						<DrawerDescription className="mx-auto">
							{"Find the compatible devices for this package"}
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
							{Object.entries(filteredDevices).map(
								([brand, devices], index) => {
									return (
										<div
											key={index}
											className="flex flex-col gap-3"
										>
											<h1 className="text-md ml-4 font-semibold uppercase">
												{brand}
											</h1>
											{devices.map(
												(
													device: any,
													index: number
												) => {
													return (
														<div
															key={index}
															className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-white px-3 py-3 transition-transform active:scale-95"
														>
															<div className="flex flex-row items-center gap-4">
																<span className="text-sm font-semibold uppercase leading-4">
																	{highlightMatches(
																		search,
																		device.name
																	)}
																</span>
															</div>
														</div>
													);
												}
											)}
										</div>
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

export default CompatibleDevicesDrawer;
