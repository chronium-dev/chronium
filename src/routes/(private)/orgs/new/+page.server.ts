// +page.server.ts
import { companySchema } from '$lib/validations/company';
import { zod4 } from 'sveltekit-superforms/adapters';
// import { message, superValidate } from 'sveltekit-superforms/server';
import type { Actions, PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { createOrg } from '$lib/server/db/queries';

export const load: PageServerLoad = async () => {
	// Pass no data → superValidate uses schema defaults → blank form
	const form = await superValidate(zod4(companySchema));
	return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(companySchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// --- YOUR CRUD HERE ---
			// await db.company.create({ data: form.data });
			await createOrg(form.data);

			return message(form, 'Company created successfully!');
		} catch (err) {
			// General (non-field) form error
			return message(form, 'Something went wrong. Please try again.', {
				status: 500
			});
		}
	}
};

// export const actions = {
// 	default: async ({ request }) => {
// 		debugger;
// 		const form = await superValidate(request, zod4(companySchema));

// 		if (!form.valid) {
// 			return { form };
// 		}

// 		// save (create or update)
// 		// await createOrg(form.data);

// 		return { form };
// 	}
// };
