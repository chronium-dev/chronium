import type { OrgListContextType } from '$lib/server/db/queries/org';
import type { Organisation } from '$lib/types/organisations';

// export type DefaultOrg = {
// 	orgId: string;
// 	name: string;
// 	logo?: string;
// };

export type UserAccessContext = {
	orgCount: number;
	orgs: OrgListContextType[];
	orgIds: string[]; // For convenience
	//defaultOrgId?: string;
	defaultOrg?: Organisation;
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
