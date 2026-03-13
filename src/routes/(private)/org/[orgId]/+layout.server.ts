import { error } from '@sveltejs/kit';

export const load = async ({ params, locals }) => {
	const user = locals.requireUser();

	if (!user.context.orgIds.includes(params.orgId)) {
		error(403, 'Access Forbidden');
	}

	return {
		orgId: params.orgId
	};
};
