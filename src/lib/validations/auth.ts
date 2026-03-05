import { z } from 'zod';

const MIN_PASSWORD_LENGTH = 10;
export const passwordMsg = `Password must be ${MIN_PASSWORD_LENGTH} characters or more in length. You can also use words and spaces.`;

export const registerSchema = z.object({
	name: z.string().optional(),
	email: z.email(),
	password: z.string().min(MIN_PASSWORD_LENGTH, passwordMsg)
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;

export const signinSchema = z.object({
	email: z.email('Please enter a valid email address'),
	password: z.string().min(MIN_PASSWORD_LENGTH, passwordMsg),
	redirect: z.string().optional()
});
export type SigninSchemaType = z.infer<typeof signinSchema>;

export const emailSchema = z.object({
	email: z.email()
});
export type EmailInput = z.infer<typeof emailSchema>;

export const forgetPasswordSchema = z.object({
	email: z.email('Please enter a valid email address.')
});

export const resetPasswordSchema = z.object({
	password: z.string().min(MIN_PASSWORD_LENGTH, passwordMsg),
	token: z.string()
});

export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const updateAccountSchema = z.object({
	name: z.string().min(1, 'Name is required').max(50, 'Name is too long - limit is 50 characters')
});
