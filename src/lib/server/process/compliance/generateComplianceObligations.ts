import type { DBExecutor } from '$lib/server/db';
import { generateAccountingPeriodObligations } from '$lib/server/process/compliance/generateAccountingPeriodObligations';
import { generateIncorporationObligations } from '$lib/server/process/compliance/generateIncorporationObligations';
import { generateVATObligations } from '$lib/server/process/compliance/generateVATObligations';
import type { Organisation } from '$lib/types/organisations';

export function generateComplianceObligations(org: Organisation, userId: string, from: Date, to: Date, tx?: DBExecutor) {
	return [
		...generateIncorporationObligations(org, from, to),
		...generateAccountingPeriodObligations(org, from, to),
		...generateVATObligations(org, from, to)
	];
}
