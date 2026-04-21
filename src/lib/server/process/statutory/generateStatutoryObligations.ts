import { type DBExecutor } from '$lib/server/db';
import { buildObligationRuntimeContext } from '$lib/server/db/queries/obligations';
import { ObligationStatusType } from '$lib/server/db/schema';
import { generateStatutoryObligationsController } from '$lib/server/process/statutory/generateStatutoryObligationsController';
import { getGenerationWindow } from '$lib/server/process/utils/getGenerationWindow';
import { insertObligationsSafely } from '$lib/server/process/utils/insertObligations';
import type { ObligationInsertSet } from '$lib/types/obligations';
import type { Organisation } from '$lib/types/organisations';
import { isLastDayInMonth, normaliseMonthEndDate } from '$lib/utils/dates';
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
export async function generateStatutoryObligations(
	org: Organisation,
	userId: string,
	tx?: DBExecutor
) {
	//
	// Do validation before anything...
	//
	if (org.vatRegistered) {
		if (!org.vatEndDate) {
			throw new Error(
				'Invalid VAT End Date - it must provided if the organisation is VAT registered.'
			);
		}

		if (!isLastDayInMonth(new UTCDate(org.vatEndDate))) {
			// Check VAT is last day of month
			//throw new Error('Invalid VAT End Date - it must be the last day of the month');
			//
			// Rather than throwing error, to reduce user friction in case of this
			// highly unlikely (probably impossible) situation, just force the date
			// to use last day of the month.
			org.vatEndDate = normaliseMonthEndDate(new UTCDate(org.vatEndDate!)).toISOString();
		}
	}

	// Establish the working window in which we will generate obligations
	const { from, to } = getGenerationWindow(org);

	// Nothing to do
	if (from >= to) return;

	const obligationRuntimeContext = await buildObligationRuntimeContext(org.id, tx);

	// Execute the generations
	const generatedObligationDates = generateStatutoryObligationsController(
		org,
		obligationRuntimeContext,
		new UTCDate(from),
		new UTCDate(to)
	);

	if (generatedObligationDates.length == 0) return;

	// Validate that the obligation template keys are present
	for (const { key } of generatedObligationDates) {
		if (!obligationRuntimeContext.definitionMap[key])
			throw new Error(`Unable to lookup generatedObligationDates key "${key}"`);
	}

	// The generators will generate virtual events within a date window that reaches into the
	// past as well as the future. The events themselves will then trigger obligations with
	// due dates in the future of each event. Some of those past events will trigger new
	// obligations into the future beyond today - these are the obligations we want to keep.
	// But some past events will trigger new obligations that are prior to today and we
	// don't want or need those, so we filter them out using the cutoffDate.
	const cutoffDate = new UTCDate();
	const obligations: ObligationInsertSet = generatedObligationDates
		.filter((row) => row.dueDate >= cutoffDate)
		.map((row) => ({
			organisationId: org.id,
			organisationObligationSettingId: obligationRuntimeContext.definitionMap[row.key].id,
			dueDate: format(row.dueDate, 'yyyy-MM-dd'),
			status: ObligationStatusType.Pending,
			assignedToUserId: userId
		}));

	await insertObligationsSafely(org.id, obligations, userId, tx);
}
