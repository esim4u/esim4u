import { useQuery } from "@tanstack/react-query";
import { getEsimPackages } from "../services";

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
