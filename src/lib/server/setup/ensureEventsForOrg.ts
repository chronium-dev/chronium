// import type { DBClient } from '$lib/server/db';
import type { DBExecutor } from '$lib/server/db';
import {
	generateAccountingRecurrence,
	generateConfirmationStatementRecurrence,
	generateEventsForOrg,
	generateFirstYearCorporationTaxEvents,
	generatePayrollRecurrence,
	generateVatRecurrence
} from '$lib/server/setup';
import type { Organisation } from '$lib/types/organisations';

export async function ensureEventsForOrg(org: Organisation, userId: string, tx?: DBExecutor) {
	// 1. Ensure recurrence rules exist
	await generateAccountingRecurrence(org, tx);
	await generateConfirmationStatementRecurrence(org, tx);
	await generateVatRecurrence(org, tx);
	await generatePayrollRecurrence(org, tx);

	// 2. Inject NON-recurring / special-case event rules (idempotent!)
	// (this should CREATE EVENTS, not patch after)
	await generateFirstYearCorporationTaxEvents(org, tx);

	// 3. Generate recurring events to horizon
	await generateEventsForOrg(org.id, tx);
}
