import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const serverEnvs = createEnv({
	server: {
		AIRALO_BUSINESS_ACCESS_TOKEN: z.string(),
		AIRALO_API_URL: z.string(),
		AIRALO_CLIENT_ID: z.string(),
		AIRALO_CLIENT_SECRET: z.string(),

		SUMUP_SECRET_KEY: z.string(),
		SUMUP_APP_ID: z.string(),
		SUMUP_PROD_MERCHANT: z.string(),
		SUMUP_API_URL: z.string(),

		STRIPE_SECRET_KEY: z.string(),

		TG_LOGGER_BOT_TOKEN: z.string(),
		ADMIN_BOT_TOKEN: z.string(),

		REDIS_API_URL: z.string(),
		REDIS_API_TOKEN: z.string(),
	},
	experimental__runtimeEnv: process.env,
	emptyStringAsUndefined: true,
});

export type ServerEnvs = typeof serverEnvs;
