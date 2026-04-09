import { type DBExecutor } from '$lib/server/db';
import { generateComplianceObligations } from '$lib/server/process/compliance/generateComplianceObligations';
import { getGenerationWindow } from '$lib/server/process/utils/getGenerationWindow';
import type { Organisation } from '$lib/types/organisations';

/**
 * This is called during the following:
 *
 * - A. On organisation creation (initial generation)
 * - B. Periodic job (rolling 90-day window)
 *
 * @param org
 * @param userId
 */
export async function invokeGenerators(org: Organisation, userId: string, tx?: DBExecutor) {
	// Establish the working window in which we will generate obligations
	const { from, to } = getGenerationWindow(org);

	// Nothing to do
	if (from >= to) return;

	await generateComplianceObligations(org, userId, from, to, tx);
}
