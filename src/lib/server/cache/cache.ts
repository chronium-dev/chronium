// src/lib/server/cache/cache.ts


export type UserAccessContext = {
	workspaceCount: number;
	templateCount: number;

	basic: {
		isBasicUser: boolean;
		workspaceId?: string;
		templateId?: string;
	};

	// future-proof
	// planType
	// permissions
	// limits
};

export type CacheEntry = {
	value: UserAccessContext;
	expiresAt: number;
};

export type Cache = {
	get<T>(key: string): Promise<T | null>;
	set<T>(key: string, value: T, ttlSeconds?: number): Promise<void>;
	del(key: string): Promise<void>;
}
