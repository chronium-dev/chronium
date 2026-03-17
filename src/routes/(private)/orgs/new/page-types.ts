// import { z } from 'zod';

// export const companySchema = z.object({
// 	id: z.string().optional(),
// 	name: z.string().min(1, 'Company name is required'),
// 	incorpDate: z.string().min(1, 'Please select a date'), // Often handled as ISO strings in forms
// 	financialYearEnd: z.string().min(1, 'Please select a date'),
// 	isVatRegistered: z.enum(['Yes', 'No'], { required_error: 'Please select an option' }),
// 	isPayrollActive: z.enum(['Yes', 'No'], { required_error: 'Please select an option' }),
// 	employeeCount: z.enum(['0', '1-5', '6-20', '20+'], { required_error: 'Select a range' }),
// 	hasPremises: z.enum(['Yes', 'No'], { required_error: 'Please select an option' })
// });

// export type CompanySchema = typeof companySchema;
