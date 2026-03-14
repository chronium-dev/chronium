import { error } from '@sveltejs/kit';

/**
 * Everything under '/orgs/[orgId]' will have access 
 * to the active org and user's role for that org.
 * 
 */
export const load = async ({ params, locals }) => {
	const user = locals.requireUser();
	const { orgIds, orgs } = user.context;

	if (!orgIds.includes(params.orgId)) {
		error(403, 'Not a member of this organisation');
	}

	const activeOrg = orgs.find((o) => o.id === params.orgId)!;

	return {
		activeOrg: {
			id: params.orgId,
			name: activeOrg.name,
			role: activeOrg.role
		}
	};
};
