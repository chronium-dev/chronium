// src/lib/server/cache/redisCache.ts
// import { VALKEY_URL } from '$env/static/private';
import Redis from 'ioredis';
import type { Cache } from './cache';

const redis = new Redis(process.env.VALKEY_URL!);

export const redisCache: Cache = {
	async get<T>(key: string): Promise<T | null> {
		const value = await redis.get(key);
		return value ? (JSON.parse(value) as T) : null;
	},

	async set<T>(key: string, value: T, ttlSeconds = 60) {
		await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
	},

	async del(key: string) {
		await redis.del(key);
	}
};
