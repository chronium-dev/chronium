import type { recurrenceRules } from '$lib/server/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

export type RecurrenceRule = InferSelectModel<typeof recurrenceRules>;

