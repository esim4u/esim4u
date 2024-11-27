import { TelegramUser } from "@/types/auth.types";
import userService from "./user.service";
import { redirect } from "next/navigation";

class AuthService {
	async auth(tgUser: TelegramUser) {
		const dbUser = await userService.getUserById(tgUser.id);

		if (dbUser?.id) {
			await userService.updateUser(tgUser, dbUser);
			return redirect("/esims");
		}

		return redirect("/onboarding");
	}
}

const authService = new AuthService();

export default authService;
