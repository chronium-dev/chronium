//getOrganisationObligationSettings;

import { getExecutor, type DBExecutor } from '$lib/server/db';
import { obligationTemplates } from '$lib/server/db/schema';

export async function getOrganisationObligationSettings(orgId: string, tx?: DBExecutor) {
	const db = getExecutor(tx);

	const settings = await db.query.organisationObligationSettings.findMany({
		columns: {
			organisationId: false,
			obligationTemplateId: false,
			customName: false,
			createdAt: false,
			updatedAt: false
		},
		where: (o, { eq, and, inArray }) =>
			and(eq(o.id, orgId), inArray(obligationTemplates.category, ['operational', 'governance'])),
		with: {
			template: {
				columns: {
					name: true,
					category: true
				}
			}
		}
	});

	return settings;
}
