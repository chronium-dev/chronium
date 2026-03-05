// +page.server.ts
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { updateAccountSchema } from '$lib/validations/auth';
import { error, fail } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import z from 'zod';
import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const currentUser = locals.requireUser();

	const [account] = await db
		.select({ id: user.id, name: user.name, email: user.email })
		.from(user)
		.where(eq(user.id, currentUser.id));

	if (!account) throw error(404, 'User not found');

	return { account };
}) satisfies PageServerLoad;

export const actions = {
	update: async ({ request, locals }) => {
		const userId = locals.user?.id;
		if (!userId) error(401);

		const formData = Object.fromEntries(await request.formData());
		const parsed = updateAccountSchema.safeParse(formData);
		if (!parsed.success) {
			return fail(400, {
				errors: z.flattenError(parsed.error).fieldErrors
			});
		}

		const { name } = parsed.data;

		try {
			await db.update(user).set({ name }).where(eq(user.id, userId));
		} catch {
			return fail(500, {
				formError: 'Could not update account'
			});
		}

		return {
			success: true
		};
	}
};
