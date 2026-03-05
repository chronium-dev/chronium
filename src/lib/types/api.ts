import { z } from 'zod';

export const apiResponseSchema = z.object({
	success: z.boolean(),
	message: z.string().optional()
});

export type ApiResponse = z.infer<typeof apiResponseSchema>;
