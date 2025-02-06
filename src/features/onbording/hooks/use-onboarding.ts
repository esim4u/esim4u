import { useMutation } from "@tanstack/react-query";
import onboardingService from "../services/onboarding.service";
import userService from "@/features/users/services/user.service";

export function useFinishOnboarding() {
	return useMutation({
		mutationFn: async ({
			tgUser,
			tonAddress,
		}: {
			tgUser: any;
			tonAddress: string;
		}) => {
			return await onboardingService.finishOnboarding(
				tgUser.id,
				tonAddress
			);
		},
		onError: (error) => {},
		onSuccess: (data) => {},
	});
}

export function useCreateUser() {
	return useMutation({
		mutationFn: async (tgUser: any) => {
			return await userService.createUser(tgUser, tgUser.start_param);
		},
		onError: (error) => {},
		onSuccess: (data) => {},
	});
}
