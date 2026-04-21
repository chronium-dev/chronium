import type { OrgListContextType } from '$lib/server/db/queries/org';

export type UserAccessContext = {
	orgCount: number;
	orgs: OrgListContextType[];
	orgIds: string[]; // For convenience
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
