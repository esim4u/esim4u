import React from "react";
import ReactCountryFlag from "react-country-flag";
import { highlightMatches } from "../lib/utils";
import { COUNTRIES } from "@/constants";

type Props = {
	network: any;
	search?: string;
};

const PackageNetworkItem = ({ network, search = "" }: Props) => {
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

export default PackageNetworkItem;
