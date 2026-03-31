import type { DBClient } from '$lib/server/db';
import {
	generateAccountingRecurrence,
	generateConfirmationStatementRecurrence,
	generateEventsForOrg,
	generateFirstYearCorporationTaxEvents,
	generatePayrollRecurrence,
	generateVatRecurrence
} from '$lib/server/setup';
import type { Organisation } from '$lib/types/organisations';

export async function ensureEventsForOrg(db: DBClient, org: Organisation, userId: string) {
	// 1. Ensure recurrence rules exist
	await generateAccountingRecurrence(db, org);
	await generateConfirmationStatementRecurrence(org);
	await generateVatRecurrence(org);
	await generatePayrollRecurrence(org);

	// 2. Inject NON-recurring / special-case event rules (idempotent!)
	// (this should CREATE EVENTS, not patch after)
	await generateFirstYearCorporationTaxEvents(org);

	// 3. Generate recurring events to horizon
	await generateEventsForOrg(org.id);
}
