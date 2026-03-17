import { z } from 'zod';

export const companySchema = z.object({
	companyName: z.string().min(2, 'Company name is required'),

	incorporationDate: z
		.string()
		.min(1, 'Incorporation date required')
		.transform((v) => new Date(v)),

	financialYearEnd: z
		.string()
		.min(1, 'Financial year end required')
		.transform((v) => new Date(v)),

	vatRegistered: z.enum(['yes', 'no']),

	payrollActive: z.enum(['yes', 'no']),

	employeeCount: z.enum(['0', '1-5', '6-20', '20+']).optional(),

	businessPremises: z.enum(['yes', 'no'])
});
