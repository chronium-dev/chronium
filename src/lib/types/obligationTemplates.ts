import type { obligationTemplates } from '$lib/server/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

export type ObligationTemplate = InferSelectModel<typeof obligationTemplates>;

export type DateOperation =
	| { type: 'add'; unit: 'days' | 'months' | 'years'; value: number }
	| { type: 'end_of_month' };

export type DateOperationPipeline = DateOperation[];

export type FirstOccurrenceBase = 'event_date' | 'incorporation_date';

export type FirstOccurrenceStrategy = 'threshold' | 'absolute';

// export const firstOccurrenceScopeEnum = pgEnum('first_occurrence_scope_enum', ['global', 'window']);
