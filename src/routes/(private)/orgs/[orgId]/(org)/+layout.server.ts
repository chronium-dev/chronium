import { error } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	const user = locals.requireUser();
	const { orgIds } = user.context;

	if (!orgIds.includes(params.orgId)) {
		error(403, 'Not a member of this organisation');
	}

	return {
		activeOrg: {
			id: params.orgId,
			name: org.name,
			role: membership.role
		}
	};
};
