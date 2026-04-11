import { type DBExecutor } from '$lib/server/db';
import { buildObligationRuntimeContext } from '$lib/server/db/queries';
import { ObligationStatusType } from '$lib/server/db/schema';
import { generateComplianceObligations } from '$lib/server/process/compliance/generateComplianceObligations';
import { getGenerationWindow } from '$lib/server/process/utils/getGenerationWindow';
import { insertObligationsSafely } from '$lib/server/process/utils/insertObligations';
import type { ObligationInsertSet } from '$lib/types/obligations';
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

	const obligationRuntimeContext = await buildObligationRuntimeContext(org.id, tx);

	// Execute the generations
	const generatedObligationDates = generateComplianceObligations(
		org,
		obligationRuntimeContext,
		new UTCDate(from),
		new UTCDate(to)
	);

	if (generatedObligationDates.length == 0) return;

	// Fetch the obligationTemplates for lookup via key
	// const allTemplates = await getExecutor(tx).select().from(obligationTemplates);
	// const templateLookup = new Map<string, ObligationTemplate>(allTemplates.map((row) => [row.key, row]));

	// Validate that the obligation template keys are present
	for (const { key } of generatedObligationDates) {
		if (!obligationRuntimeContext.definitionMap[key])
			throw new Error(`Unable to lookup generatedObligationDates key "${key}"`);
	}

	const obligations: ObligationInsertSet = generatedObligationDates.map((row) => ({
		organisationId: org.id,
		organisationObligationSettingId: obligationRuntimeContext.definitionMap[row.key].id,  // TODO WRONG VALUE!!
		dueDate: format(row.dueDate, 'yyyy-MM-dd'),
		status: ObligationStatusType.Pending,
		assignedToUserId: userId
	}));

	await insertObligationsSafely(obligations, userId, tx);
}
