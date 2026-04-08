import { getExecutor, type DBExecutor } from '$lib/server/db';
import { organisation } from '$lib/server/db/schema';
import { generateObligationsForOrg } from '$lib/server/process/generateObligationsForOrg';
import { insertObligationsSafely } from '$lib/server/process/insertObligations';
import { getGenerationWindow } from '$lib/server/process/utils/getGenerationWindow';
import type { Organisation } from '$lib/types/organisations';
import { eq } from 'drizzle-orm';

export async function generateForOrganisation(org: Organisation, userId: string, tx?: DBExecutor) {

  // Establish the working window in which we will generate obligations
	const { from, to } = getGenerationWindow(org);

	// Nothing to do
	if (from >= to) return;

	const db = getExecutor(tx);

	// Fetch the 'obligationDefinitions' and associated 'recurrenceRule' object
	const definitions = await db.query.obligationDefinitions.findMany({
		with: {
			recurrenceRule: true
		}
	});

	const obligations = await generateObligationsForOrg(org, definitions, from, to, userId);

	await insertObligationsSafely(obligations, userId, tx);

	// Advance horizon
	await db
		.update(organisation)
		.set({ obligationGenerationHorizon: to })
		.where(eq(organisation.id, org.id));
}
