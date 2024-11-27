import { TelegramUser } from "@/types/auth.types";
import userService from "./user.service";

class AuthService {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async auth(tgUser: TelegramUser) {
		const dbUser = await userService.getUserById(tgUser.id);

		if (dbUser?.id) {
			await userService.updateUser(tgUser, dbUser);
			return { user: dbUser, isNewUser: false };
		}

		return { user: tgUser, isNewUser: true };
	}
}

const authService = new AuthService();

export default authService;
