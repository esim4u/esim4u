import { useQuery } from "@tanstack/react-query";
import { getEsimPackages } from "../services/packages";
import { getPackageNetworks } from "../services/networks";

export function useGetPackages({ lang = "en" }) {
	return useQuery({
		queryKey: ["packages", lang],
		queryFn: async () => {
			const data = await getEsimPackages({
				lang,
			});

			return data;
		},
	});
}

export function useGetPackageNetworks(package_id: string, enabled = true) {
	return useQuery({
		queryKey: ["networks", package_id],
		queryFn: async () => {
			const data = await getPackageNetworks(package_id);

			return data;
		},
		enabled,
	});
}
