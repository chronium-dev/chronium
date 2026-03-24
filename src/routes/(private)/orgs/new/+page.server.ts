// +page.server.ts
import { organisationFormSchema } from '$lib/validations/organisation';
import { zod4 } from 'sveltekit-superforms/adapters';
// import { message, superValidate } from 'sveltekit-superforms/server';
import { createOrg } from '$lib/server/db/queries';
import { generateCompliancePack } from '$lib/server/setup/generateCompliancePack';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import type { Actions, PageServerLoad } from './$types';
import type { NewOrganisation, Organisation } from '$lib/types/organisations';

export const load: PageServerLoad = async () => {
	// Pass no data → superValidate uses schema defaults → blank form
	const form = await superValidate(zod4(organisationFormSchema));
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(organisationFormSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			const newOrg: Organisation = await createOrg(form.data);
			await generateCompliancePack(newOrg);

			return message(form, 'Company created successfully!');
		} catch (err) {
			// General (non-field) form error
			return message(form, 'Something went wrong. Please try again.', {
				status: 500
			});
		}
	}
};
