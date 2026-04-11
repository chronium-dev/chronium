import {
	generateAccountingPeriodObligations,
	generateIncorporationObligations
} from '$lib/server/process/compliance';
import type { ObligationRuntimeContext } from '$lib/types/obligations';
import type { Organisation } from '$lib/types/organisations';
import type { UTCDate } from '@date-fns/utc';

export function generateComplianceObligations(
	org: Organisation,
	context: ObligationRuntimeContext,
	from: UTCDate,
	to: UTCDate
) {
	const all = [
		...generateAccountingPeriodObligations(org, from, to),
		...generateIncorporationObligations(org, from, to)
		// ...generateVATObligations(org, from, to)
	];

	// 🔥 Filter by enabled keys
	return all.filter((o) => context.enabledKeys.has(o.key));
}
