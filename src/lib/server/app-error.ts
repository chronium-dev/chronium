import type { AppError } from '$lib/types/errors';
import { error } from '@sveltejs/kit';

export function throwAppError(status: number, message: string, code?: string): never {
	const err = new Error(message) as AppError;
	if (code)	err.code = code;
	error(status, err);
}
