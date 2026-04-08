import { db } from '$lib/server/db';
import { generateForOrganisation } from '$lib/server/process/generateForOrganisation';
import type { Organisation } from '$lib/types/organisations';

/**
 * This is called during the following:
 *
 * - A. On organisation creation (initial generation)
 * - B. Periodic job (rolling 90-day window)
 *
 * @param org
 * @param userId
 */
export async function invokeGenerators(org: Organisation, userId: string) {
	await db.transaction(async (tx) => {
		await generateForOrganisation(org, userId, tx);
	});
}
