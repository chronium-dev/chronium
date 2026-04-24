import type { Obligation, ObligationRuntimeContext } from '$lib/types/obligations';
import { eq, sql } from 'drizzle-orm';
import { getExecutor, type DBExecutor } from '../index';
import {
	ObligationCategoryType,
	obligationTemplates,
	organisationObligationSettings
} from '../schema';
import z from 'zod';

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

// export type StatsList = {
// 	key: string;
// 	name: string;
// 	category: string;
// 	eventLabel: string;
// 	count: number;
// };
const ObligationDateSchema = z.object({
	event_date: z.string().nullable(),
	due_date: z.string().nullable()
});

const ObligationSummarySchema = z.object({
	key: z.string(),
	name: z.string(),
	category: z.string(),
	event_label: z.string().nullable(),
	dates: z.array(ObligationDateSchema)
});

export type ObligationSummary = z.infer<typeof ObligationSummarySchema>;

export async function getObligationsList(orgId: string, tx?: DBExecutor): Promise<ObligationSummary[]> {
	const db = getExecutor(tx);

	const result = await db.execute(sql`
      SELECT
					ot.key,
					ot.name,
					ot.category,
					ot.event_label,
					json_agg(
									json_build_object(
													'event_date', o.event_date,
													'due_date', o.due_date
									) ORDER BY o.event_date
					) AS dates
			FROM obligations o
							JOIN public.organisation o2 ON o2.id = o.organisation_id
							JOIN public.organisation_obligation_settings oos ON oos.id = o.organisation_obligation_setting_id
							JOIN public.obligation_templates ot ON ot.id = oos.obligation_template_id
			WHERE o2.id = ${orgId}
			GROUP BY ot.key, ot.name, ot.category, ot.event_label
			ORDER BY ot.name;
    `);

	return z.array(ObligationSummarySchema).parse(result);
}
