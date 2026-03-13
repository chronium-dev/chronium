import type { OrgListContextType } from '$lib/server/db/queries';

export type UserAccessContext = {
	orgCount: number;
	// orgIds: string[];
	orgs: OrgListContextType[];
	defaultOrgId?: string;
};

export type CacheEntry = {
	value: UserAccessContext;
	expiresAt: number;
};

export type Cache = {
	get<T>(key: string): Promise<T | null>;
	set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
	del(key: string): Promise<void>;
};
