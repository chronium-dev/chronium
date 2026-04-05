import type { DBExecutor } from '$lib/server/db';
import {
	generateAccountingRecurrence,
	generateEventsForOrg,
	// generateFirstYearCorporationTaxEvents,
	getFirstAccountingPeriodEnd
} from '$lib/server/setup';
import type { Organisation } from '$lib/types/organisations';

export async function ensureEventsForOrg(org: Organisation, userId: string, tx?: DBExecutor) {
	// 1. Ensure recurrence rules exist
	await generateAccountingRecurrence(org, tx);
	// await generateConfirmationStatementRecurrence(org, tx);
	// await generateVatRecurrence(org, tx);
	// await generatePayrollRecurrence(org, tx);

	// 2. Inject NON-recurring / special-case event rules (idempotent!)
	// (this should CREATE EVENTS, not patch after)
	// const firstAccountingEnd = getFirstAccountingPeriodEnd(org);
	// const now = new Date();
	// if (now <= firstAccountingEnd) {
	// 	// For NEW companies still in first accounting period generate split CT events
	// 	await generateFirstYearCorporationTaxEvents(org, tx);
	// }

	// 3. Generate recurring events to horizon
	await generateEventsForOrg(org.id, tx);
}
