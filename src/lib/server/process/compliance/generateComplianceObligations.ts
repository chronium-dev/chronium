import type { DBExecutor } from '$lib/server/db';
import {
	generateAccountingPeriodObligations,
	generateIncorporationObligations,
	generateVATObligations
} from '$lib/server/process/compliance';
import type { Organisation } from '$lib/types/organisations';
import type { UTCDate } from '@date-fns/utc';

export function generateComplianceObligations(
	org: Organisation,
	userId: string,
	from: UTCDate,
	to: UTCDate,
	tx?: DBExecutor
) {
	return [
		...generateAccountingPeriodObligations(org, from, to),
		...generateIncorporationObligations(org, from, to),
		...generateVATObligations(org, from, to)
	];
}
