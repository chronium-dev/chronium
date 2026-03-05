import { db } from '$lib/server/db';
import { rating, template } from '$lib/server/db/schema';
import { createId } from '$lib/utils/createid.js';
import { ratingInputSchema } from '$lib/validations/ratings.js';
import { error, fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import z from 'zod';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const { templateId } = params;
	console.log('templateId:', templateId);

	const temp = await db.query.template.findFirst({
		where: eq(template.id, templateId)
	});
	if (!temp) {
		throw error(404, 'Template not found');
	}

	return {
		success: true,
		template: temp
	};
};

export const actions = {
	saveRating: async ({ request, url }) => {
		const formData = Object.fromEntries(await request.formData());
		const parsed = ratingInputSchema.safeParse(formData);
		if (!parsed.success) {
			return fail(400, {
				errors: z.flattenError(parsed.error).fieldErrors
			});
		}

		// console.log('formData:', formData);
		// console.log('parsed.data:', parsed.data);
		const { templateId, starRating, comment, email, workspaceId } = parsed.data;
		const ratingId = createId();
		await db
			.insert(rating)
			.values({ id: ratingId, starRating, comment, email, templateId, workspaceId });

		// Get current pathname and append /thankyou
		const thankYouPath = `${url.pathname}/thankyou`;

		// Redirect to the thank you page
		redirect(303, thankYouPath);
	}
};
