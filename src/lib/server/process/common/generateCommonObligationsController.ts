import type { ObligationRuntimeContext } from '$lib/types/obligations';
import type { Organisation } from '$lib/types/organisations';
import type { UTCDate } from '@date-fns/utc';

export function generateCommonObligationsController(
	org: Organisation,
	context: ObligationRuntimeContext,
	from: UTCDate,
	to: UTCDate
) {
	const all = [];

	// TODO - iterate over all selected organisationObligationSettings and execute generateCommonObligations() for each

	//const all = generateCommonObligations(org, from, to);

	return all;
}
