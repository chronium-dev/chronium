export interface ErrorRecovery {
	href: string;
	label: string;
}

export interface AppError extends Error {
	code: string | null;
}