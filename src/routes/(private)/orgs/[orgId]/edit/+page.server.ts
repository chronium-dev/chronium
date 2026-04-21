import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod4 } from 'sveltekit-superforms/adapters';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
	// --- FETCH YOUR RECORD HERE ---
	// const company = await db.company.findUnique({ where: { id: params.id } });
	// if (!company) throw error(404, 'Company not found');

	// Mock — replace with real data:
	// const company: OrganisationFormData = {
	// 	name: 'Acme Ltd',
	// 	incorporationDate: '2020-01-15',
	// 	financialYearEnd: '2024-12-31',
	// 	vatRegistered: 'yes' as const,
	// 	payrollActive: 'yes' as const,
	// 	employeeCount: '1-5' as const,
	// 	businessPremises: 'yes' as const
	// };

	// // Passing existing data pre-populates the form
	// const form = await superValidate(company, zod4(organisationFormSchema));
	// return { form };
};

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod4(organisationFormSchema));
		const theData = form.data;

		if (!form.valid) {
			return fail(400, { form });
		}

		try {
			// --- YOUR UPDATE CRUD HERE ---
			// await db.company.update({ where: { id: event.params.id }, data: form.data });
			await updateOrg(form.data);

			return message(form, 'Company updated successfully!');
		} catch (err) {
			return message(form, 'Something went wrong. Please try again.', {
				status: 500
			});
		}
	}
};
