// src/routes/auth/verify-result/+page.server.ts
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const error = url.searchParams.get('error');
	if (error) {
		return redirect(302, '/reset-password-error')
	}
};
