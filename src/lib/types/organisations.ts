import type { organisation } from '$lib/server/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

export type Organisation = InferSelectModel<typeof organisation>;