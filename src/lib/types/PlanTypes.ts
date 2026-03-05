import type { plan } from '$lib/server/db/schema';

export const PlanTypes = {
	Free: 1,
	Standard: 2,
	Pro: 3
} as const;

//Derive a union type automatically
export type PlanType = (typeof PlanTypes)[keyof typeof PlanTypes];

export type Plan = typeof plan.$inferSelect;
