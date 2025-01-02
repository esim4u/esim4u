import { User } from "@telegram-apps/sdk-react";

export interface TelegramUser extends User {
	startParam?: string | undefined; // Adjust type based on `initData.startParam` structure
	platform?: string | undefined; // Adjust type based on `lp?.platform` structure
}

export interface AuthParams {
	initDataRaw: string;
	parent_id?: number | undefined;
	platform?: string | undefined;
	is_tma_started?: boolean | undefined;
}
