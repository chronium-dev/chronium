// src/routes/auth/verify-result/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

/**
 *
 * We come here after the user clicks on the verify email link
 *
 */
export const load: PageServerLoad = ({ url }) => {
	// const status = url.searchParams.get('status');
	const error = url.searchParams.get('error');

	url.searchParams.forEach((value, key) => {
		console.log(value, key);
	});

	// ✅ Success: redirect to signin page with verified flag
	if (!error) {
		throw redirect(302, '/signin?status=1');
	}

	throw redirect(302, `/verify-error?reason=${error}`);
};
