import { db } from '$lib/server/db';
import { template } from '$lib/server/db/schema';
import { error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
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
