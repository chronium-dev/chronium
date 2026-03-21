import { z } from 'zod';

export const companySchema = z
	.object({
		id: z.string().optional(),
		name: z
			.string({ error: 'Company name is required' })
			.min(2, 'Must be at least 2 characters')
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
		employeeCount: z.enum(['0', '1-5', '6-20', '20+']).optional(),
		businessPremises: z.enum(['yes', 'no'], {
			error: 'Please select an option'
		})
	})
	.superRefine((data, ctx) => {
		if (data.payrollActive === 'yes' && !data.employeeCount) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Please select the number of employees',
				path: ['numberOfEmployees']
			});
		}
	});

export type CompanySchema = typeof companySchema;
export type CompanyFormData = z.infer<typeof companySchema>;

// export const companySchema = z
// 	.object({
// 		companyName: z.string().min(1, 'Company name required'),
// 		incorporationDate: z.string().min(1, 'Required'),
// 		financialYearEnd: z.string().min(1, 'Required'),
// 		vatRegistered: z.enum(['yes', 'no']),
// 		payrollActive: z.enum(['yes', 'no']),
// 		businessPremises: z.enum(['yes', 'no']),
// 		employeeCount: z.enum(['0', '1-5', '6-20', '20+']).optional()
// 	})
// 	.refine(
// 		(data) => {
// 			if (data.payrollActive === 'yes') {
// 				return !!data.employeeCount;
// 			}
// 			return true;
// 		},
// 		{
// 			message: 'Employee count required when payroll is active',
// 			path: ['employeeCount']
// 		}
// 	);

// export type CompanySchema = typeof companySchema;
