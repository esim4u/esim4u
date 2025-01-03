import { useQuery } from "@tanstack/react-query";
import userService from "../services/user.service";

export function useGetUserById(
	telegram_id: number | undefined,
	enabled = true
) {
	return useQuery({
		queryKey: ["user", telegram_id],
		queryFn: async () => {
			if (!telegram_id) {
				throw new Error("Telegram ID is required");
			}

			const data = await userService.getUserById(telegram_id);
			return data;
		},
		enabled: enabled && !!telegram_id,
	});
}
