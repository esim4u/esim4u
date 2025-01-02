import { useMutation } from "@tanstack/react-query";
import onboardingService from "../services/onboarding.service";

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
