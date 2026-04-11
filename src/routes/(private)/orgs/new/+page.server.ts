// +page.server.ts
import { db } from '$lib/server/db';
import { createOrg } from '$lib/server/db/queries';
import { generateAndPersistComplianceObligations } from '$lib/server/process/generateAndPersistComplianceObligations';
import { inferVatQuarterGroup } from '$lib/server/process/utils/inferVatQuarterGroup';
import type { FormMessage } from '$lib/types/forms';
import { isLastDayOfMonth } from '$lib/utils/dates';
import { organisationFormSchema } from '$lib/validations/organisation';
import { UTCDate } from '@date-fns/utc';
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
	const financialYearEndIsLastDay = isLastDayOfMonth(data.financialYearEnd);
	if (data.vatRegistered === 'yes' && data.vatFrequency === 'quarterly' && data.vatStartDate) {
		const startDate = endOfMonth(new UTCDate(data.vatStartDate + '-01'));
		const vatQuarterGroup = inferVatQuarterGroup(startDate);
		return {
			...data,
			vatQuarterGroup,
			vatStartDate: endOfMonth(startDate).toISOString(),
			financialYearEndIsLastDay
		};
	}
	return { ...data, financialYearEndIsLastDay };
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
			// ✅ Apply the transforms only here, after superforms has validated
			const result = organisationFormSchemaTransformed.parse(form.data);

			await db.transaction(async (tx) => {
				const createResult = await createOrg(result, userId, tx);
				if (!createResult.ok) {
					return setError(form, 'name', createResult.message);
				}

				await generateAndPersistComplianceObligations(createResult.org, userId, tx);

				return message(form, { status: 200, text: 'Company created successfully!' });
			});
		} catch (err) {
			// Unexpected errors
			console.log('err:', err);
			throw err;
		}
	}
};
