import {
	getPhotoUrlFromFileId,
	sendWelcomeMessageToUser,
	updateUserPhoto,
} from "@/lib/grammy";
import supabase from "@/lib/supabase";
import { TelegramUser } from "@/features/auth/types/auth.types";
import { sendTgLog } from "@/lib/tg-logger";
class UserService {
	async getUserById(id: number) {
		const { data } = await supabase
			.from("users")
			.select("*")
			.eq("telegram_id", id)
			.eq("onboarding", true)
			.limit(1);

		if (!data || data.length === 0) {
			return null;
		}

		if (data[0].photo) {
			const photoUrl = await getPhotoUrlFromFileId(data[0].photo);
			data[0].photo_url = photoUrl;
		}

		return data[0];
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

		const users = await supabase
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

		console.log("updateData", users.data);

		await updateUserPhoto(tgUser.id);

		return users.data;
	}

	async createUser(tgUser: TelegramUser, parent_id: number) {
		const users = await supabase
			.from("users")
			.select("*")
			.eq("telegram_id", tgUser.id);

		await sendTgLog("Creating user: " + JSON.stringify(tgUser, null, 2));

		if (users.error) {
			throw new Error(users.error.message);
		}

		if (users.data.length > 0) {
			const updatedUser = await supabase
				.from("users")
				.update([
					{
						username: tgUser.username || null,
						first_name: tgUser.firstName || null,
						last_name: tgUser.lastName || null,
						language_code: tgUser.languageCode || null,
						is_premium: tgUser.isPremium ? true : false,
						platform: tgUser.platform || null,
					},
				])
				.eq("telegram_id", tgUser.id);

			if (updatedUser.error) {
				console.error("Update user error: " + updatedUser.error);
				await sendTgLog("Update user error: " + updatedUser.error);
			}

			return updatedUser.data;
		}

		const createdUser = await supabase.from("users").insert([
			{
				telegram_id: tgUser.id || null,
				created_date: new Date(),
				username: tgUser.username || null,
				first_name: tgUser.firstName || null,
				last_name: tgUser.lastName || null,
				language_code: tgUser.languageCode || null,
				is_premium: tgUser.isPremium ? true : false,
				platform: tgUser.platform || null,
				parent_id: parent_id && !isNaN(parent_id) ? parent_id : null,
			},
		]);

		if (createdUser.error) {
			console.error("Create user error: " + createdUser.error);
			await sendTgLog(
				"Cteate user error: " +
					JSON.stringify(createdUser.error, null, 2)
			);
		}

		if (parent_id && isNaN(parent_id)) {
			await this.addExternalAdUser(
				tgUser.id,
				tgUser.username || "",
				parent_id.toString()
			);
		}

		await sendWelcomeMessageToUser(tgUser.id);

		return createdUser.data;
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

	async addExternalAdUser(id: number, username: string, match: string) {
		const externalAdUsers = await supabase
			.from("external_ads")
			.select("*")
			.eq("telegram_id", id);

		if (externalAdUsers.error) {
			return externalAdUsers.error;
		}

		if (externalAdUsers?.data?.length > 0) {
			let channels = externalAdUsers.data[0].channel;

			if (channels.some((channel: any) => channel.channel === match)) {
				return "Channel already exists";
			} else {
				channels = [{ date: new Date(), channel: match }, ...channels];
			}

			const updatedExternalAdUsers = await supabase
				.from("external_ads")
				.update({
					telegram_id: id,
					channel: channels,
				})
				.eq("telegram_id", id)
				.select("*");

			if (updatedExternalAdUsers.error) {
				return updatedExternalAdUsers.error;
			}

			return updatedExternalAdUsers.data;
		}

		const user = await supabase
			.from("users")
			.select("*")
			.eq("telegram_id", id);

		if (user.error) {
			return user.error;
		}
		if (user.data.length > 0) {
			return "User already exists";
		}

		const newUser = await supabase
			.from("users")
			.insert({
				telegram_id: id,
				username: username,
				created_date: new Date(),
				onboarding: false,
			})
			.select("*");

		if (newUser.error) {
			return newUser.error;
		}
		if (newUser.data.length == 0) {
			return "User not created";
		}

		const newExternalAdUsers = await supabase
			.from("external_ads")
			.insert({
				telegram_id: id,
				channel: [
					{
						date: new Date(),
						channel: match,
					},
				],
			})
			.select("*");

		if (newExternalAdUsers.error) {
			return newExternalAdUsers.error;
		}
		if (newExternalAdUsers.data.length == 0) {
			return "External Ad User not created";
		}

		return newExternalAdUsers.data;
	}

	async addReferrerToUser(id: number, username: string, referrer_id: string) {
		const referrer = await supabase
			.from("users")
			.select("*")
			.eq("telegram_id", referrer_id);

		if (referrer.error) {
			return referrer.error;
		}
		if (referrer?.data?.length == 0) {
			return "Referrer not found";
		}

		const user = await supabase
			.from("users")
			.select("*")
			.eq("telegram_id", id);

		if (user.error) {
			return user.error;
		}
		if (user.data.length > 0) {
			return "User already exists";
		}

		const newUser = await supabase
			.from("users")
			.insert({
				telegram_id: id,
				username: username,
				parent_id: referrer_id,
				created_date: new Date(),
				onboarding: false,
			})
			.select("*");

		if (newUser.error) {
			return newUser.error;
		}
		if (newUser.data.length == 0) {
			return "User not created";
		}

		return newUser.data;
	}

	async getUserReferrals(id: number) {
		const users = await supabase
			.from("users")
			.select("*, orders: orders(count)")
			.eq("parent_id", id)
			.eq("orders.status", "SUCCESS");

		return users.data;
	}
}

const userService = new UserService();

export default userService;
