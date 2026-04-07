import { db } from '$lib/server/db';
import { generateObligationsForOrg } from '$lib/server/process/generateObligationsForOrg';
import type { Organisation } from '$lib/types/organisations';
import { addDays } from 'date-fns';

export async function invokeGenerators(org: Organisation, userId: string) {
	await db.transaction(async (tx) => {

		const definitions = await db.query.obligationDefinitions.findMany({
			with: {
				recurrenceRule: true
			}
		});

		const obligations = await generateObligationsForOrg(
			org,
			definitions,
			new Date(),
			addDays(new Date(), 90)
		);
		
		// // 1. Ensure that all events have been created for org
		// await ensureEventsForOrg(org, userId, tx);

		// // 2. Generate obligations from ALL events
		// await generateObligationsForOrg(org, userId, tx);
	});

}
