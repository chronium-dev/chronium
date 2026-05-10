import { fail } from '@sveltejs/kit';

import { superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';

import { getOrganisationObligationSettings } from '$lib/server/db/queries/obligation-settings';
import { obligationSettingsFormSchema } from '$lib/validations/obligation-settings';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	const settings = await getOrganisationObligationSettings(params.orgId);
	// console.log('settings:', settings);

	const form = await superValidate(
		{
			settings
		},
		zod4(obligationSettingsFormSchema)
	);

	return {
		form
	};
};

export const actions: Actions = {
	save: async ({ request, params, locals }) => {
		const form = await superValidate(request, zod4(obligationSettingsFormSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		//await saveOrganisationObligationSettings(params.id, form.data.settings);

		//await regenerateCommonObligationsForOrganisation(params.id, locals.user.id);

		return {
			form
		};
	}
};
