import type { events, recurrenceRules } from '$lib/server/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

export type RecurrenceRule = InferSelectModel<typeof recurrenceRules>;
export type Event = InferSelectModel<typeof events>;