import { getExecutor, type DBExecutor } from '$lib/server/db';
import { organisationObligationSettings } from '$lib/server/db/schema';
import { generateCommonObligations } from '$lib/server/process/common/generateCommonObligations';
import type { GeneratedObligation, ObligationRuntimeContext } from '$lib/types/obligations';
import type { Organisation } from '$lib/types/organisations';
import type { UTCDate } from '@date-fns/utc';
import { eq } from 'drizzle-orm';

export async function generateCommonObligationsController(
	org: Organisation,
	context: ObligationRuntimeContext,
	from: UTCDate,
	to: UTCDate,
	tx?: DBExecutor
) {
	const db = getExecutor(tx);

	const settingsForOrg = await db
		.select()
		.from(organisationObligationSettings)
		.where(eq(organisationObligationSettings.organisationId, org.id));

	// Iterate over all selected organisationObligationSettings and execute
	// generateCommonObligations() for each setting.
	const obligations: GeneratedObligation[] = [];
	for (const setting of settingsForOrg.filter((s) => s.configured)) {
		obligations.push(...generateCommonObligations(setting, from, to));
	}

	return obligations;
}
