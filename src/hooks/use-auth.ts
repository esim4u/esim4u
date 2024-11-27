import authService from "@/services/auth.service";
import { TelegramUser } from "@/types/auth.types";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export function useAuth() {
    const router = useRouter();
	return useMutation({
		mutationFn: async (tgUser: TelegramUser) => {
			return await authService.auth(tgUser);
		},
		onError: async (error) => {
            console.error(error);
		},
		onSuccess: async (data) => {
            if(data.isNewUser){
                return router.push("/onboarding");
            }
    
            return router.push("/esims");
		},
	});
}