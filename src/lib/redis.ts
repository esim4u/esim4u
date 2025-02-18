import { serverEnvs } from "@/env/server";
import { Redis } from "@upstash/redis";

const redis = new Redis({
	url: serverEnvs.REDIS_API_URL,
	token: serverEnvs.REDIS_API_TOKEN,
});

export default redis;
