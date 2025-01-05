"use client";

import React from "react";
import { useRouter } from "next/navigation";

import AdPlaceholder from "./ad-placeholder";
import PackageItem from "./package-item";

type Props = {
	packages: any[];
	search: string;
};

const PackagesList = ({ packages, search }: Props) => {
	if (packages.length === 0) {
		return <AdPlaceholder />;
	}
	return (
		<div className="flex flex-col gap-2">
			{packages.map((country: any, index: number) => {
				return (
					<PackageItem
						key={index}
						country={country}
						search={search}
					/>
				);
			})}
		</div>
	);
};

export default PackagesList;
