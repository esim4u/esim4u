import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { getStories } from "../services/stories";

export function useGetStories({
	preferredLanguage,
}: {
	preferredLanguage: string | undefined;
}) {
	return useQuery({
		queryKey: ["stories"],
		queryFn: async () => {
			const data = await getStories(preferredLanguage);
			return data;
		},
		placeholderData: keepPreviousData,
	});
}
