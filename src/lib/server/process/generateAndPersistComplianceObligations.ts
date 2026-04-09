import { getExecutor, type DBExecutor } from '$lib/server/db';
import { ObligationStatusType, obligationTemplates } from '$lib/server/db/schema';
import { generateComplianceObligations } from '$lib/server/process/compliance/generateComplianceObligations';
import { getGenerationWindow } from '$lib/server/process/utils/getGenerationWindow';
import { insertObligationsSafely } from '$lib/server/process/utils/insertObligations';
import type { ObligationInsertSet, ObligationTemplate } from '$lib/types/obligations';
import type { Organisation } from '$lib/types/organisations';
import { UTCDate } from '@date-fns/utc';
import { format } from 'date-fns';

/**
 * This is called during the following:
 *
 * - A. On organisation creation (initial generation)
 * - B. Periodic job (rolling 90-day window)
 *
 * @param org
 * @param userId
 */
export async function generateAndPersistComplianceObligations(
	org: Organisation,
	userId: string,
	tx?: DBExecutor
) {
	// Establish the working window in which we will generate obligations
	const { from, to } = getGenerationWindow(org);

	// Nothing to do
	if (from >= to) return;

	const obligationDates = generateComplianceObligations(
		org,
		userId,
		new UTCDate(from),
		new UTCDate(to),
		tx
	);

	// Fetch the obligationTemplates for lookup via key
	const db = getExecutor(tx);
	const allTemplates = await db.select().from(obligationTemplates);
	const lookup = new Map<string, ObligationTemplate>(allTemplates.map((row) => [row.key, row]));

	// Validate that the obligation template keys are present
	for (const { key } of obligationDates) {
		if (!lookup.has(key)) throw new Error(`Unable to lookup obligationTemplate key "${key}"`);
	}

	// TODO We must clone obligationTemplate records and put them in the obligationDefinition table
	// if they don't already exist.

	const obligations: ObligationInsertSet = obligationDates.map((row) => ({
		organisationId: org.id,
		obligationDefinitionId: lookup.get(row.key)!.id,
		dueDate: format(row.dueDate, 'yyyy-MM-dd'),
		status: ObligationStatusType.Pending,
		assignedToUserId: userId
	}));

	await insertObligationsSafely(obligations, userId, tx);
}
