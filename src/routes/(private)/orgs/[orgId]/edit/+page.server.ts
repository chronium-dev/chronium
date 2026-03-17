import type { PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { organisation } from '$lib/server/db/schema';
import { getOrg } from '$lib/server/db/queries';
import { companySchema } from '$lib/validations/company';
import { superValidate } from 'sveltekit-superforms/server';
import zod from 'zod';
import { error } from '@sveltejs/kit';

export const load = (async ({params}) => {
	const existingCompany = await getOrg(params.orgId);
	if (!existingCompany) {
		error(404, 'Organisation deos not exist')
	}

	const form = await superValidate(existingCompany ?? {}, zod(companySchema));

	return { form };
}) satisfies PageServerLoad;
