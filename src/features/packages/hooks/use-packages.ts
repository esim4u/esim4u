import { useQuery } from "@tanstack/react-query";
import { getCountryPackages, getEsimPackages } from "../services/packages";
import { getPackageNetworks } from "../services/networks";

export function useGetPackages({ lang = "en" }) {
	return useQuery({
		queryKey: ["packages", `lang-${lang}`],
		queryFn: async () => {
			return await getEsimPackages({
				lang,
			});
		},
	});
}

export function useGetCountryPackages(country_code: string) {
	return useQuery({
		queryKey: ["packages", `country-${country_code}`],
		queryFn: async () => {
			return await getCountryPackages({
				country_code,
			});
		},
	});
}

export function useGetPackageNetworks(package_id: string, enabled = true) {
	return useQuery({
		queryKey: ["networks", package_id],
		queryFn: async () => {
			return await getPackageNetworks(package_id);
		},
		enabled,
	});
}
