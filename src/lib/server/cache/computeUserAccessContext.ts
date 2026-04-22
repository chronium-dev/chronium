import type { UserAccessContext } from '$lib/server/cache/cache';
import { db } from '$lib/server/db';
import { getOrg, getOrgs } from '$lib/server/db/queries/org';

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

	// const org = await db.query.organisation.findFirst({
	// 	where: (o, { eq }) => eq(o.id, defaultOrgId)
	// });

	const org = await getOrg(defaultOrgId);

	return {
		orgCount: orgs.length,
		orgs,
		orgIds,
		defaultOrg: org
	};
}
