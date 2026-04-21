import type { ObligationRuntimeContext } from '$lib/types/obligations';
import { eq, sql } from 'drizzle-orm';
import { getExecutor, type DBExecutor } from '../index';
import {
	ObligationCategoryType,
	obligationTemplates,
	organisationObligationSettings
} from '../schema';

// ============================================================================
// OBLIGATION QUERIES
// ============================================================================

/**
 *
 * @param orgId Create links (join) between organisation and obligationTemplates
 * @param tx
 */
export async function seedOrganisationObligationSettings(orgId: string, tx?: DBExecutor) {
	const db = getExecutor(tx);

	const templates = await db.select().from(obligationTemplates);

	await db.insert(organisationObligationSettings).values(
		templates.map((t) => ({
			key: t.key,
			organisationId: orgId,
			obligationTemplateId: t.id,
			enabled: t.category === ObligationCategoryType.Statutory // default rule
		}))
	);
}

export async function buildObligationRuntimeContext(
	orgId: string,
	tx?: DBExecutor
): Promise<ObligationRuntimeContext> {
	const db = getExecutor(tx);
	const rows = await db
		.select({
			key: organisationObligationSettings.key,
			id: organisationObligationSettings.id,
			enabled: organisationObligationSettings.enabled
		})
		.from(organisationObligationSettings)
		.where(eq(organisationObligationSettings.organisationId, orgId));

	const enabledKeys = new Set<string>();
	const definitionMap: Record<string, { id: string; key: string }> = {};

	for (const row of rows) {
		definitionMap[row.key] = { id: row.id, key: row.key };

		if (row.enabled) {
			enabledKeys.add(row.key);
		}
	}

	return { enabledKeys, definitionMap };
}

export type StatsList = {
	key: string;
	name: string;
	category: string;
	count: number;
};

export async function getStats(orgId: string, tx?: DBExecutor): Promise<StatsList[]> {
	const db = getExecutor(tx);

	const result = await db.execute<StatsList>(sql`
      SELECT ot.key, ot.name, ot.category, COUNT(*)::int as count
      FROM obligations o
              JOIN public.organisation o2 ON o2.id = o.organisation_id
              JOIN public.organisation_obligation_settings oos ON oos.id = o.organisation_obligation_setting_id
              JOIN public.obligation_templates ot ON ot.id = oos.obligation_template_id
      WHERE o2.id = ${orgId}
      GROUP BY 1, 2, 3
      ORDER BY 2;
    `);

	return result;
}
