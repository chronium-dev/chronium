// generateCompliancePack.ts

import { generateAccountingRecurrence } from '$lib/server/setup/generateAccountingRecurrence';
import { generateConfirmationStatementRecurrence } from '$lib/server/setup/generateConfirmationStatementRecurrence';
import { generateEventsForOrg } from '$lib/server/setup/generateEventsForOrg';
import { generateFirstYearCorporationTaxEvents } from '$lib/server/setup/generateFirstYearCorporationTaxEvents';
import { generateObligationsForOrg } from '$lib/server/setup/generateObligationsForOrg';
import { generatePayrollRecurrence } from '$lib/server/setup/generatePayrollRecurrence';
import { generateVatRecurrence } from '$lib/server/setup/generateVatRecurrence';
import type { Organisation } from '$lib/types/organisations';

export async function generateCompliancePack(org: Organisation, userId: string) {
	// 1. Recurrence rules
	await generateAccountingRecurrence(org);
	await generateConfirmationStatementRecurrence(org);
	await generateVatRecurrence(org);
	await generatePayrollRecurrence(org);

	// 2. Generate recurring events
	await generateEventsForOrg(org.id);

	// 3. 🔥 Inject CT first-year overrides
	await generateFirstYearCorporationTaxEvents(org);

	// 4. Obligations
	await generateObligationsForOrg(org.id, userId);
}
