//getOrganisationObligationSettings;

import { getExecutor, type DBExecutor } from '$lib/server/db';
import { obligationTemplates, organisationObligationSettings } from '$lib/server/db/schema';
import { and, asc, eq, inArray } from 'drizzle-orm';

export async function getOrganisationObligationSettings(orgId: string, tx?: DBExecutor) {
	const db = getExecutor(tx);

	// try {
	// 	const settings = await db.query.organisationObligationSettings.findMany({
	// 		columns: {
	// 			organisationId: false,
	// 			obligationTemplateId: false,
	// 			customName: false,
	// 			createdAt: false,
	// 			updatedAt: false
	// 		},
	// 		where: (o, { eq, and, inArray }) =>
	// 			and(eq(o.id, orgId), inArray(obligationTemplates.category, ['operational', 'governance'])),
	// 		with: {
	// 			template: {
	// 				columns: {
	// 					name: true,
	// 					category: true
	// 				}
	// 			}
	// 		}
	// 	});

	// 	return settings;
	// } catch (e) {
	// 	console.log(e);
	// }

	const settings = await db
		.select({
			// Explicitly select only what you need
			id: organisationObligationSettings.id,
			key: organisationObligationSettings.key,
			enabled: organisationObligationSettings.enabled,
			frequency: organisationObligationSettings.frequency,
			interval: organisationObligationSettings.interval,
			anchorDate: organisationObligationSettings.anchorDate,
			dayOfWeek: organisationObligationSettings.dayOfWeek,
			dayOfMonth: organisationObligationSettings.dayOfMonth,
			monthOfYear: organisationObligationSettings.monthOfYear,
			recurrenceType: organisationObligationSettings.recurrenceType,
			configured: organisationObligationSettings.configured,
			obligationTemplateName: obligationTemplates.name,
			obligationTemplateDescription: obligationTemplates.description,
			category: obligationTemplates.category
		})
		.from(organisationObligationSettings)
		.innerJoin(
			obligationTemplates,
			eq(organisationObligationSettings.obligationTemplateId, obligationTemplates.id)
		)
		.where(
			and(
				eq(organisationObligationSettings.organisationId, orgId), // Note: Make sure this is orgId, not id
				inArray(obligationTemplates.category, ['operational', 'governance'])
			)
		)
		.orderBy(asc(obligationTemplates.name));

	return settings;
}
