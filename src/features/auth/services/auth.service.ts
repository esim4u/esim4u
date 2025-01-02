import { TelegramUser } from "@/features/auth/types/auth.types";
import userService from "@/features/users/services/user.service";

class AuthService {
	async auth(tgUser: TelegramUser) {
		const dbUser = await userService.getUserById(tgUser.id);

		if (dbUser?.id) {
			await userService.updateUser(tgUser, dbUser);
			return {
				user: dbUser,
				isNew: false,
			}
		}

		return {
			user: tgUser,
			isNew: true,
		}
	}
}

const authService = new AuthService();

export default authService;
