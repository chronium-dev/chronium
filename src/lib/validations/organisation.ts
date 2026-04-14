import { pgEnum } from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const employeeCountEnum = pgEnum('employee_count_enum', ['0', '1-5', '6-20', '20+']);
export const vatFrequencyEnum = pgEnum('vat_frequency_enum', ['quarterly', 'monthly', 'annual']);
export const payeFrequencyEnum = pgEnum('paye_frequency_enum', ['quarterly', 'monthly']);

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
			.min(1, 'Incorporation date is required'),
		// .default('2025-02-12'),
		financialYearEnd: z
			.string({ error: 'Next financial year end date is required' })
			.min(1, 'Next financial year end date is required'),
		// .default('2027-02-28'),
		vatRegistered: z.enum(['yes', 'no'], {
			error: 'Please select an option'
		}),
		vatFrequency: z.enum(vatFrequencyEnum.enumValues).nullish().default('quarterly'),
		// How often do they submit returns? 'quarterly' | 'monthly' | 'annual'

		vatEndDate: z.string().nullish(),

		payrollActive: z.enum(['yes', 'no'], {
			error: 'Please select an option'
		}),
		// Only required when payrollActive === 'yes' — enforced with superRefine
		employeeCount: z.enum(employeeCountEnum.enumValues).nullish(),
		payeFrequency: z.enum(payeFrequencyEnum.enumValues).nullish().default('monthly'),
		// How often do they submit paye returns? 'quarterly' | 'monthly' | 'annual'

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

		if (data.vatRegistered === 'yes' && !data.vatEndDate) {
			ctx.addIssue({
				code: 'custom',
				message: 'Please enter your next VAT period end',
				path: ['vatEndDate']
			});
		}
	});

export type OrganisationSchema = typeof organisationFormSchema;
export type OrganisationFormData = z.infer<typeof organisationFormSchema>;
