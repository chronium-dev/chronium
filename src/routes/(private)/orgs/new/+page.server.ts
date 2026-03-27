// +page.server.ts
import { createOrg } from '$lib/server/db/queries';
import { generateCompliancePack } from '$lib/server/setup/generateCompliancePack';
import { inferVatQuarterGroup } from '$lib/server/setup/inferVatQuarterGroup';
import type { FormMessage } from '$lib/types/forms';
import { organisationFormSchema } from '$lib/validations/organisation';
import { error, fail } from '@sveltejs/kit';
import { endOfMonth } from 'date-fns';
import { message, setError, superValidate, type Infer } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
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
		return { ...data, vatQuarterGroup, vatStartDate: endOfMonth(startDate).toISOString() };
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

		const form = await superValidate<Infer<typeof organisationFormSchema>, FormMessage>(
			event,
			zod4(organisationFormSchema)
		);
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

			await generateCompliancePack(createResult.org, userId);

			return message(form, { status: 200, text: 'Company created successfully!' });
		} catch (err) {
			// Unexpected errors
			console.log('err:', err);
			throw err;
		}
	}
};
