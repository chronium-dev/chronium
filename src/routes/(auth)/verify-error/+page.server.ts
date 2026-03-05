// src/routes/auth/verify-error/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ url }) => {
	const reason = url.searchParams.get('reason');
	return {
		reason
	};
};
