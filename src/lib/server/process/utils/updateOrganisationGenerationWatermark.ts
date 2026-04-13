import { getExecutor, type DBExecutor } from '$lib/server/db';
import { organisation } from '$lib/server/db/schema';
import { UTCDate } from '@date-fns/utc';
import { eq } from 'drizzle-orm';

export async function updateOrganisationGenerationWatermark(orgId: string, tx?: DBExecutor) {
	const db = getExecutor(tx);
	await db
		.update(organisation)
		.set({ obligationsGeneratedTo: new UTCDate().toISOString() })
		.where(eq(organisation.id, orgId));
}
