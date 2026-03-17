import { superValidate } from 'sveltekit-superforms/server';
import { zod } from 'sveltekit-superforms/adapters';
import { companySchema } from '$lib/validations/company';
import { createOrg } from '$lib/server/db/queries.js';

export const load = async () => {
	const form = await superValidate(zod(companySchema));

	return { form };
};

export const actions = {
	default: async ({ request }) => {
		const form = await superValidate(request, zod(companySchema));

		if (!form.valid) {
			return { form };
		}

		await createOrg(form.data);

		return { form };
	}
};
