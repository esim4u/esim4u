import userService from "@/services/user.service";
import { TelegramUser } from "@/types/auth.types";
import { useMutation } from "@tanstack/react-query";

export function useCreateUser() {
	return useMutation({
		mutationFn: async (tgUser: TelegramUser) => {
			return await userService.createUser(tgUser);
		},
		onError: (error) => {
			console.error(error);
		},
		onSuccess: (data) => {
			console.log(data);
		},
	});
}

export function useFinishUserOnboarding() {
	return useMutation({
		mutationFn: async ({
			tgUser,
			tonAddress,
		}: {
			tgUser: TelegramUser;
			tonAddress: string;
		}) => {
			return await userService.finishOnboarding(tgUser.id, tonAddress);
		},
		onError: (error) => {
			console.error(error);
		},
		onSuccess: (data) => {
			console.log(data);
		},
	});
}
