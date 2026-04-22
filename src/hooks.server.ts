import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { getUserAccessContext } from '$lib/server/cache/userAccessContextCache';
import { redirect, type Handle } from '@sveltejs/kit';
import { svelteKitHandler } from 'better-auth/svelte-kit';

export const handle: Handle = async ({ event, resolve }) => {
	// 1. Handle Better Auth internal requests (signin, signup, callback, etc.)
	// These routes manage their own session logic.
	if (event.url.pathname.startsWith('/api/auth')) {
		return svelteKitHandler({ event, resolve, auth, building });
	}

	// 2. Fetch the session ONCE for all other requests
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (session) {
		event.locals.session = session.session;
		event.locals.user = {
			...session.user,
			context: await getUserAccessContext(session.user.id)
		};
	}

	// 3. Define the protection helper
	event.locals.requireUser = () => {
		if (!event.locals.user) {
			throw redirect(303, '/signin');
		}
		return event.locals.user;
	};

	event.locals.requireActiveOrg = () => {
		const user = event.locals.requireUser();
		const org = user.context.defaultOrg;
		// if (!orgId) {
		// 	throw redirect(303, '/orgs/new');
		// }
		return org;
	};

	// 4. Global Route Guard: Protect multiple routes automatically
	// Add any path prefix here that requires a logged-in user.
	// const protectedPrefixes = ['/dashboard', '/settings', '/org', '/admin'];
	// const isProtected = protectedPrefixes.some((path) => event.url.pathname.startsWith(path));

	// if (isProtected) {
	// 	event.locals.requireUser();
	// }

	// 5. Proceed with the request
	return resolve(event);
};

/***** ORIGINAL BELOW ******************************************************** */


// import { building } from '$app/environment';
// import { auth } from '$lib/server/auth';
// import { getUserAccessContext } from '$lib/server/cache/userAccessContextCache';
// import { redirect, type Handle } from '@sveltejs/kit';
// import { sequence } from '@sveltejs/kit/hooks';
// import { svelteKitHandler } from 'better-auth/svelte-kit';

// export const authHandle: Handle = async ({ event, resolve }) => {
// 	// console.log('hooks.server: event:', event);
// 	return svelteKitHandler({ event, resolve, auth, building });
// };

// export const sessionHandle: Handle = async ({ event, resolve }) => {
// 	const session = await auth.api.getSession({
// 		headers: event.request.headers
// 	});

// 	if (session) {
// 		event.locals.session = session.session;
// 		event.locals.user = {
// 			...session.user,
// 			context: await getUserAccessContext(session.user.id)
// 		};
// 	}

// 	event.locals.requireUser = () => {
// 		if (!event.locals.user) {
// 			throw redirect(303, '/signin');
// 		}
// 		return event.locals.user;
// 	};

// 	const response = await resolve(event);
// 	return response;
// };

// export const handle = sequence(authHandle, sessionHandle);
