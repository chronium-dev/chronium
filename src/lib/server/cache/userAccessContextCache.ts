import type { UserAccessContext } from '$lib/server/cache/cache';
import { computeUserAccessContext } from '$lib/server/cache/computeUserAccessContext';
import { redisCache } from '$lib/server/cache/redisCache';

const KEY_PREFIX = 'user-access';

function key(userId: string) {
	return `${KEY_PREFIX}:${userId}`;
}

export async function getUserAccessContext(userId: string) {
	const cached = await redisCache.get<UserAccessContext>(key(userId));
	if (cached) return cached;

	const computed = await computeUserAccessContext(userId);

	await redisCache.set(key(userId), computed, 300); // 5 mins
	return computed;
}

export async function invalidateUserAccessContext(userId: string) {
	await redisCache.del(key(userId));
}
