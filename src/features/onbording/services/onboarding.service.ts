import { getPhotoUrlFromFileId, updateUserPhoto } from "@/lib/grammy";
import supabase from "@/lib/supabase";
import { TelegramUser } from "@/features/auth/types/auth.types";
class OnboardingService {
	async finishOnboarding(telegram_id: string, wallet_address: string) {
		const users = await supabase
			.from("users")
			.select("*")
			.eq("telegram_id", telegram_id);

		if (users.error) {
			console.error(users.error);
		}
		if (!users.data || users.data.length === 0) {
			return;
		}
		await supabase
			.from("users")
			.update({ onboarding: true })
			.eq("telegram_id", telegram_id);

		const wallets = await supabase
			.from("wallet")
			.select("*")
			.eq("telegram_id", telegram_id);

		if (!wallets.data || wallets.data.length > 0) {
			const updatedWallet = await supabase
				.from("wallet")
				.update({
					address: wallet_address,
					connected: wallet_address ? true : false,
				})
				.eq("telegram_id", telegram_id)
				.select();

			if (updatedWallet.error) {
				console.error(updatedWallet.error);
			}

			return updatedWallet.data;
		}

		const createdWallet = await supabase.from("wallet").insert({
			telegram_id,
			amount: 0,
			address: wallet_address ? wallet_address : null,
		});

		if (createdWallet.error) {
			console.error(createdWallet.error);

			return createdWallet;
		}

		return createdWallet.data;
	}
}

const onboardingService = new OnboardingService();

export default onboardingService;
