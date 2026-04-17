import type { UserAccessContext } from '$lib/server/cache/cache';
import { db } from '$lib/server/db';
import { getOrgs } from '$lib/server/db/queries';

export async function computeUserAccessContext(userId: string): Promise<UserAccessContext> {
	const orgs = await getOrgs(userId);
	const orgIds = orgs.map((o) => o.id);

	// 👇 fetch user default org
	const user = await db.query.user.findFirst({
		where: (u, { eq }) => eq(u.id, userId),
		columns: {
			defaultOrgId: true
		}
	});

	let defaultOrgId = user?.defaultOrgId;

	// 🔒 Safety: ensure it's still valid
	if (!defaultOrgId || !orgIds.includes(defaultOrgId)) {
		defaultOrgId = orgIds[0] ?? undefined;
	}

	return {
		orgCount: orgs.length,
		orgs,
		orgIds,
		defaultOrgId
	};
}
