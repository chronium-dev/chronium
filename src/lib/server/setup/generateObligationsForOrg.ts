// src/lib/server/engine/generateObligations.ts

import { db } from '$lib/server/db';
import { obligations } from '$lib/server/db/schema';
import { addDays, addMonths } from 'date-fns';

export async function generateObligationsForOrg(orgId: string, userId: string) {
	const orgEvents = await db.query.events.findMany({
		where: (e, { eq }) => eq(e.organisationId, orgId)
	});

	for (const event of orgEvents) {
		const templates = await db.query.obligationTemplates.findMany({
			where: (t, { eq }) => eq(t.triggerEventTypeId, event.eventTypeId)
		});

		for (const template of templates) {
			const dueDate = addDays(addMonths(new Date(event.eventDate), template.dueOffsetMonths), template.dueOffsetDays);

			await db
				.insert(obligations)
				.values({
					organisationId: orgId,
					obligationTypeId: template.obligationTypeId,
					templateId: template.id,
					generatedFromEventId: event.id,
					assignedToUserId: userId,
					dueDate,
					generated: true
				})
				.onConflictDoNothing();
		}
	}
}
