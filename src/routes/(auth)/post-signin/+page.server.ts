// src/routes/auth/verify-result/+page.server.ts
import { auth } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// Post-signin checks: If the user logs in successfully, the
// user is redirected here to check if their email address
// has been verified, they may not be. This situation can arise
// if the user registered their email but the
// follow-up verification email verification link was not
// clicked by the user (or something failed during that process)
export const load: PageServerLoad = async ({ locals, url }) => {
	const redirectUrl = url.searchParams.get('redirect');

	if (!locals.user) {
		// Not logged-in guard
		const redirectTo = '/signin' + (redirectUrl ? `?${redirectUrl}` : '');
		throw redirect(303, redirectTo);
	}

	// Is Logged-in, but not verified
	if (!locals.user.emailVerified) {
		await auth.api.sendVerificationEmail({
			body: {
				email: locals.user.email,
				callbackURL: '/verify-email' // The redirect URL after verification
			}
		});

		redirect(307, `/verify-email-sent`);
	}

	// Is logged-in and verified. If url includes redirect then
	// go there, otherwise redirect to dashboard.
	const redirectTo = redirectUrl ? redirectUrl : '/dashboard';
	throw redirect(303, redirectTo);
};
