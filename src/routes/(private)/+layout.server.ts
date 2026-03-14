import { requireAuth } from '../../lib/auth/require-auth';

/**
 * Everything below '(private)' route requires signin
 */
export const load = async (ctx) => {
	const { user } = requireAuth(ctx);
	return { user };
};
