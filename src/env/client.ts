import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const clientEnvs = createEnv({
	client: {
		NEXT_PUBLIC_ADMIN_BOT_TOKEN: z.string(),

		NEXT_PUBLIC_TELEGRAM_WEB_APP_URL: z.string(),
		NEXT_PUBLIC_ESIM4U_ACCESS_TOKEN: z.string(),

		NEXT_PUBLIC_BOT_USERNAME: z.string(),
		NEXT_PUBLIC_BOT_TOKEN: z.string(),

		NEXT_PUBLIC_TG_LOGGER_BOT_TOKEN: z.string(),

		NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string(),
		NEXT_PUBLIC_SUPABASE_URL: z.string(),

		NEXT_PUBLIC_TON_WALLET: z.string(),

		NEXT_PUBLIC_MOCK_INIT_DATA_RAW: z.string().optional(),
	},
	experimental__runtimeEnv: {
		NEXT_PUBLIC_ADMIN_BOT_TOKEN:
			process.env.NEXT_PUBLIC_ADMIN_BOT_TOKEN,
		NEXT_PUBLIC_TELEGRAM_WEB_APP_URL:
			process.env.NEXT_PUBLIC_TELEGRAM_WEB_APP_URL,
		NEXT_PUBLIC_ESIM4U_ACCESS_TOKEN:
			process.env.NEXT_PUBLIC_ESIM4U_ACCESS_TOKEN,

		NEXT_PUBLIC_BOT_USERNAME: process.env.NEXT_PUBLIC_BOT_USERNAME,
		NEXT_PUBLIC_BOT_TOKEN: process.env.NEXT_PUBLIC_BOT_TOKEN,

		NEXT_PUBLIC_TG_LOGGER_BOT_TOKEN:
			process.env.NEXT_PUBLIC_TG_LOGGER_BOT_TOKEN,
		NEXT_PUBLIC_SUPABASE_ANON_KEY:
			process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
		NEXT_PUBLIC_TON_WALLET: process.env.NEXT_PUBLIC_TON_WALLET,

		NEXT_PUBLIC_MOCK_INIT_DATA_RAW:
			process.env.NEXT_PUBLIC_MOCK_INIT_DATA_RAW,
	},
	emptyStringAsUndefined: true,
});

export type ClientEnvs = typeof clientEnvs;
