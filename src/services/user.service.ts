import { getPhotoUrlFromFileId, updateUserPhoto } from "@/lib/grammy";
import supabase from "@/lib/supabase";
import { TelegramUser } from "@/types/auth.types";
class UserService {
	async getUserById(id: number) {
		const { data } = await supabase
			.from("users")
			.select("*")
			.eq("telegram_id", id)
			.eq("onboarding", true)
			.single();

		if (data && data.photo) {
			const photoUrl = await getPhotoUrlFromFileId(data.photo);
			data.photo_url = photoUrl;
		}

		return data;
	}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
	async updateUser(tgUser: TelegramUser, dbUser: any) {
		let lastLoginDates = dbUser.last_login_date.dates || [];
		lastLoginDates.unshift(new Date().toISOString());

		//only keep the last 5 login dates
		if (lastLoginDates.length > 5) {
			lastLoginDates = lastLoginDates.slice(0, 5);
		}
		const lastLoginDate = {
			counter: dbUser.last_login_date.counter
				? dbUser.last_login_date.counter + 1
				: 1,
			dates: lastLoginDates,
		};

		const { data } = await supabase
			.from("users")
			.update([
				{
					username: tgUser.username || null,
					first_name: tgUser.firstName || null,
					last_name: tgUser.lastName || null,
					language_code: tgUser.languageCode || null,
					is_premium: tgUser.isPremium ? true : false,
					platform: tgUser.platform || null,
					last_login_date: lastLoginDate,
				},
			])
			.eq("telegram_id", tgUser.id);

		await updateUserPhoto(tgUser.id);

		return data;
	}

	async addUserPhotoFileId(id: number, username: string, photo_url: string) {
		const { data: user } = await supabase
			.from("users")
			.select("*")
			.eq("telegram_id", id);

		if (user && user?.length > 0) {
			const { data } = await supabase
				.from("users")
				.update({ photo: photo_url, username: username })
				.eq("telegram_id", id);

			return data;
		}

		const { data } = await supabase.from("users").insert({
			telegram_id: id,
			photo: photo_url,
			onboarding: false,
			username: username,
		});

		return data;
	}
}

const userService = new UserService();

export default userService;
