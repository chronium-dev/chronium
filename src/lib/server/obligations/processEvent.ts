import { db } from '$lib/server/db';
import { obligations, obligationTemplates } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { Event } from './types';
import { addDays } from 'date-fns';

export async function processEvent(event: Event) {
	const templates = await db
		.select()
		.from(obligationTemplates)
		.where(eq(obligationTemplates.triggerEventTypeId, event.eventTypeId));

	for (const template of templates) {
		const dueDate = addDays(event.eventDate, template.dueOffsetDays);

		await db.insert(obligations).values({
			organisationId: event.organisationId,
			obligationTypeId: template.obligationTypeId,
			templateId: template.id,
			generatedFromEventId: event.id,
			dueDate
		});
	}
}
