// generateCompliancePack.ts

import { ensureEventsForOrg } from '$lib/server/setup/ensureEventsForOrg';
import { generateObligationsForOrg } from '$lib/server/setup/generateObligationsForOrg';
import type { Organisation } from '$lib/types/organisations';

export async function generateCompliancePack(org: Organisation, userId: string) {
	// 1. Ensure that all events have been created for org
	await ensureEventsForOrg(org, userId);

	// 2. Generate obligations from ALL events
	await generateObligationsForOrg(org.id, userId);
}
