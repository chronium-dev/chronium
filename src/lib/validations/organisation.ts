import { pgEnum } from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const employeeCountEnum = pgEnum('employee_count_enum', ['0', '1-5', '6-20', '20+']);
export const vatFrequencyEnum = pgEnum('vat_frequency_enum', ['quarterly', 'monthly', 'annual']);
export const vatQuarterGroupEnum = pgEnum('vat_quarter_group_enum', ['jan', 'feb', 'mar']);


export const organisationFormSchema = z
	.object({
		id: z.string().optional(),
		name: z
			.string({ error: 'Company name is required' })
			.min(2, 'Must be at least 2 characters long')
			.max(100, 'Must be 100 characters or fewer')
			.default('ABC Motors Ltd'),
		incorporationDate: z
			.string({ error: 'Incorporation date is required' })
			.min(1, 'Incorporation date is required')
			.default('2025-02-12'),
		financialYearEnd: z
			.string({ error: 'Next financial year end date is required' })
			.min(1, 'Next financial year end date is required')
			.default('2025-02-28'),
		vatRegistered: z.enum(['yes', 'no'], {
			error: 'Please select an option'
		}),
		vatFrequency: z.enum(vatFrequencyEnum.enumValues).nullish().default('quarterly'),
		// How often do they submit returns? 'quarterly' | 'monthly' | 'annual'

		vatQuarterGroup: z.enum(vatQuarterGroupEnum.enumValues).nullish().default('mar'),
		// If quarterly → which stagger? 'jan' | 'feb' | 'mar' (NULL if not quarterly)

		vatStartDate: z.string().nullish(),

		payrollActive: z.enum(['yes', 'no'], {
			error: 'Please select an option'
		}),
		// Only required when payrollActive === 'yes' — enforced with superRefine
		//employeeCount: z.enum(['0', '1-5', '6-20', '20+']).nullish(),
		// This automatically pulls ['0', '1-5', '6-20', '20+']
		employeeCount: z.enum(employeeCountEnum.enumValues).nullish(),
		businessPremises: z.enum(['yes', 'no'], {
			error: 'Please select an option'
		})
	})
	.superRefine((data, ctx) => {
		if (data.payrollActive === 'yes' && !data.employeeCount) {
			ctx.addIssue({
				code: 'custom',
				message: 'Please select the number of employees',
				path: ['employeeCount']
			});
		}

		if (data.vatRegistered === 'yes' && !data.vatFrequency) {
			ctx.addIssue({
				code: 'custom',
				message: 'Please select VAT submission frequency',
				path: ['vatFrequency']
			});
		}

		if (data.vatRegistered === 'yes' && !data.vatStartDate) {
			ctx.addIssue({
				code: 'custom',
				message: 'Please enter your next VAT period end',
				path: ['vatStartDate']
			});
		}
	});

// Transformed schema — used only on the server when processing the submission
// export const organisationFormSchemaTransformed = organisationFormSchema.transform((data) => {
// 	if (data.vatRegistered === 'yes' && data.vatFrequency === 'quarterly' && data.vatStartDate) {
// 		const startDate = endOfMonth(new Date(data.vatStartDate + '-01'));
// 		const vatQuarterGroup = inferVatQuarterGroup(startDate);
// 		// const vatQuarterGroup = {};
// 		return { ...data, vatQuarterGroup };
// 	}
// 	return data;
// });

export type OrganisationSchema = typeof organisationFormSchema;
export type OrganisationFormData = z.infer<typeof organisationFormSchema>;
// export type OrganisationFormDataTransformed = z.infer<typeof organisationFormSchemaTransformed>;
