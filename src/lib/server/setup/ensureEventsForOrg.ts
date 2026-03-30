import { generateAccountingRecurrence } from '$lib/server/setup/generateAccountingRecurrence';
import { generateConfirmationStatementRecurrence } from '$lib/server/setup/generateConfirmationStatementRecurrence';
import { generateEventsForOrg } from '$lib/server/setup/generateEventsForOrg';
import { generateFirstYearCorporationTaxEvents } from '$lib/server/setup/generateFirstYearCorporationTaxEvents';
import { generatePayrollRecurrence } from '$lib/server/setup/generatePayrollRecurrence';
import { generateVatRecurrence } from '$lib/server/setup/generateVatRecurrence';
import type { Organisation } from '$lib/types/organisations';

export async function ensureEventsForOrg(org: Organisation, userId: string) {
	// 1. Ensure recurrence rules exist
	await generateAccountingRecurrence(org);
	await generateConfirmationStatementRecurrence(org);
	await generateVatRecurrence(org);
	await generatePayrollRecurrence(org);

	// 2. Inject NON-recurring / special-case event rules (idempotent!)
	// (this should CREATE EVENTS, not patch after)
	await generateFirstYearCorporationTaxEvents(org);

	// 3. Generate recurring events to horizon
	await generateEventsForOrg(org.id);
}
