// +page.server.ts
import { organisationFormSchema } from '$lib/validations/organisation';
import { zod4 } from 'sveltekit-superforms/adapters';
// import { message, superValidate } from 'sveltekit-superforms/server';
import { createOrg } from '$lib/server/db/queries';
import { generateCompliancePack } from '$lib/server/setup/generateCompliancePack';
import { inferVatQuarterGroup } from '$lib/server/setup/inferVatQuarterGroup';
import { error, fail } from '@sveltejs/kit';
import { endOfMonth } from 'date-fns';
import { message, setError, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Pass no data → superValidate uses schema defaults → blank form
	const form = await superValidate(zod4(organisationFormSchema));
	return { form };
};

const organisationFormSchemaTransformed = organisationFormSchema.transform((data) => {
	if (data.vatRegistered === 'yes' && data.vatFrequency === 'quarterly' && data.vatStartDate) {
		const startDate = endOfMonth(new Date(data.vatStartDate + '-01'));
		const vatQuarterGroup = inferVatQuarterGroup(startDate);
		// const vatQuarterGroup = {};
		return { ...data, vatQuarterGroup };
	}
	return data;
});

export const actions: Actions = {
	default: async (event) => {
		const { locals } = event;
		const userId = locals.user?.id;

		if (!userId) {
			error(401, 'Unauthorized');
		}

		const form = await superValidate(event, zod4(organisationFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// ✅ Apply the transform only here, after superforms has validated
			const result = organisationFormSchemaTransformed.parse(form.data);

			const createResult = await createOrg(result, userId);
			if (!createResult.ok) {
				return setError(form, 'name', createResult.message);
			}

			await generateCompliancePack(createResult.org);

			return message(form, 'Company created successfully!');
		} catch (err) {
			// Unexpected errors
			throw err;
		}
	}
};
