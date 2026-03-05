import type { RequestEvent } from '@sveltejs/kit';
import { error, redirect } from '@sveltejs/kit';

type RequireAuthOptions = {
	redirectToSignin?: boolean;
};

/**
 * Check if the user is authenticated. If they are then
 * return the Session and the User objects, otehrwise redirect them
 * to the signin page.
 */
export function requireAuth(event: RequestEvent, options: RequireAuthOptions = {}) {
	const { locals, url, route } = event;

	if (locals.session && locals.user) {
		return {
			session: locals.session,
			user: locals.user
		};
	}

	const shouldRedirect =
		options.redirectToSignin ??
		// pages & layouts always have a route.id
		Boolean(route?.id);

	if (shouldRedirect) {
		const redirectTo = encodeURIComponent(url.pathname + url.search);
		throw redirect(302, `/signin?redirect=${redirectTo}`);
	}

	throw error(401, 'Authentication required');
}
