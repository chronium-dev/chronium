// insertObligationsSafely.ts

import { getExecutor, type DBExecutor } from '$lib/server/db';
import { obligations } from '$lib/server/db/schema';
import { updateOrganisationGenerationWatermark } from '$lib/server/process/utils/updateOrganisationGenerationWatermark';
import type { ObligationInsertSet } from '$lib/types/obligations';

function dedupe(rows: ObligationInsertSet) {
	const seen = new Set<string>();

	return rows.filter((r) => {
		const key = `${r.organisationId}-${r.organisationObligationSettingId}-${r.dueDate}`;

		if (seen.has(key)) return false;
		seen.add(key);
		return true;
	});
}

export async function insertObligationsSafely(
	orgId: string,
	rows: ObligationInsertSet,
	userId: string,
	tx?: DBExecutor
) {
	if (rows.length === 0) return;

	const db = getExecutor(tx);

	await db.insert(obligations).values(dedupe(rows)).onConflictDoNothing();
	await updateOrganisationGenerationWatermark(orgId, tx);
}
