import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { getUserAccessContext } from '$lib/server/cache/userAccessContextCache';
import { redirect, type Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { svelteKitHandler } from 'better-auth/svelte-kit';

export const authHandle: Handle = async ({ event, resolve }) => {
	// console.log('hooks.server: event:', event);
	return svelteKitHandler({ event, resolve, auth, building });
};

export const sessionHandle: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	if (session) {
		event.locals.session = session.session;
		event.locals.user = {
			...session.user,
			context: await getUserAccessContext(session.user.id)
		};
		//event.locals.db = db;

		// // Check for pending invitation cookie
		// const invitationId = event.cookies.get('pending_invitation');
		// if (invitationId) {
		// 	// Process the invitation
		// 	console.log(`hooks.server - invitationId:`, invitationId);
		// 	// await processInvitation(session.user.id, invitationId);

		// 	// Clear the cookie
		// 	event.cookies.delete('pending_invitation', { path: '/' });
		// }
	}

	event.locals.requireUser = () => {
		if (!event.locals.user) {
			throw redirect(303, '/login');
		}
		return event.locals.user;
	};

	const response = await resolve(event);
	return response;
};

// export const log: Handle = async ({ event, resolve }) => {
// 	console.log('Before Page hit');
// 	const response = await resolve(event);
// 	console.log('After Page hit');
// 	return response;
// };
// export const log_two: Handle = async ({ event, resolve }) => {
// 	console.log('Before LOG 2 Page hit');
// 	const response = await resolve(event);
// 	console.log('After LOG 2 Page hit');
// 	return response;
// };

export const handle = sequence(authHandle, sessionHandle);
