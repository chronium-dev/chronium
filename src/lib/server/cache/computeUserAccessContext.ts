import type { UserAccessContext } from '$lib/server/cache/cache';
import { getOrgs } from '$lib/server/db/queries';

export async function computeUserAccessContext(userId: string): Promise<UserAccessContext> {
	const orgs = await getOrgs(userId);
	return {
		orgCount: orgs.length,
		orgs,
		defaultOrgId: orgs.length === 1 ? orgs[0].id : undefined
	};
}
