import type { obligationDefinitions } from '$lib/server/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

export type Definition = InferSelectModel<typeof obligationDefinitions>;
export type DefinitionSet = Definition[];
