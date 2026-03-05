import type { z } from 'zod';

export type FieldErrors = Record<string, string[]>;

export function zodFieldErrors(issues: z.ZodIssue[]): FieldErrors {
	const errors: FieldErrors = {};

	for (const issue of issues) {
		const field = issue.path[0];

		if (typeof field !== 'string') continue;

		(errors[field] ??= []).push(issue.message);
	}

	return errors;
}
