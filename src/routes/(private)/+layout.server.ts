import { redirect } from '@sveltejs/kit';

/**
 * Everything inside '(private)' route requires an authenticated
 * user, so we call requireAuth() here. This means that we don't
 * need to call it in any pages within (private), and we make
 * the 'user' available for all child routes.
 */
// export const load = async (ctx) => {
// 	const { user } = requireAuth(ctx);
// 	return { user };
// };
export const load = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(303, '/signin');
	}
	return { user: locals.user };
};
