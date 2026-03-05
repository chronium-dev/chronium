import { requireAuth } from "../../lib/auth/require-auth";

export const load = async (ctx) => {
	const { user } = requireAuth(ctx);
	return { user };
};
