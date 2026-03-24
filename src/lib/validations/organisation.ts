import { pgEnum } from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const employeeCountEnum = pgEnum('employee_count_enum', ['0', '1-5', '6-20', '20+']);

export const organisationFormSchema = z
	.object({
		id: z.string().optional(),
		name: z
			.string({ error: 'Company name is required' })
			.min(2, 'Must be at least 2 characters long')
			.max(100, 'Must be 100 characters or fewer'),
		incorporationDate: z
			.string({ error: 'Incorporation date is required' })
			.min(1, 'Incorporation date is required'),
		financialYearEnd: z
			.string({ error: 'Financial year end date is required' })
			.min(1, 'Financial year end date is required'),
		vatRegistered: z.enum(['yes', 'no'], {
			error: 'Please select an option'
		}),
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
	});

export type OrganisationSchema = typeof organisationFormSchema;
export type OrganisationFormData = z.infer<typeof organisationFormSchema>;
