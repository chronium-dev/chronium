import { db } from '$lib/server/db';
import { obligations, ObligationStatusType } from '$lib/server/db/schema';
import { generateObligationsForOrg } from '$lib/server/setup/generateObligationsForOrg';
import type { Organisation } from '$lib/types/organisations';
import { addDays } from 'date-fns';
import { and, eq, gte, notInArray } from 'drizzle-orm';

/**
 * The UI must call this when updates are made to any existing settings.
 * 
 * @param org 
 * @param userId 
 * @param cutoffDate 
 */
async function regenerateObligations(org: Organisation, userId: string, cutoffDate: Date) {
	// 🔒 Safety window (optional but recommended)
	const safeWindow = addDays(new Date(), 7);

	// 🧹 Delete future, non-completed obligations
	await db.delete(obligations).where(
		and(
			eq(obligations.organisationId, org.id),
			gte(obligations.eventDate, cutoffDate),
			gte(obligations.dueDate, safeWindow), // 👈 prevents surprises
			notInArray(obligations.status, [ObligationStatusType.Completed])
		)
	);

	// 🔁 Regenerate deterministically
	await generateObligationsForOrg(org, userId);
}
