import { db } from '$lib/server/db';
import { eventTypes, recurrenceRules } from '$lib/server/db/schema';
import { generateEventsForOrg } from '$lib/server/setup/generateEventsForOrg';
import { generateObligationsForOrg } from '$lib/server/setup/generateObligationsForOrg';
import { eq } from 'drizzle-orm';

type SelectedEventConfig = {
	eventTypeKey: string;
	startDate: Date;
	frequency: 'monthly' | 'yearly';
	interval?: number;
	name?: string;
};

export async function applySelectedEventTypes(orgId: string, selections: SelectedEventConfig[]) {
	for (const sel of selections) {
		const eventType = await db.query.eventTypes.findFirst({
			where: eq(eventTypes.key, sel.eventTypeKey)
		});

		if (!eventType) continue;

		await db.insert(recurrenceRules).values({
			organisationId: orgId,
			eventTypeId: eventType.id,
			name: sel.name ?? eventType.name,
			startDate: sel.startDate,
			frequency: sel.frequency,
			interval: sel.interval ?? 1
		});
	}

	// regenerate future timeline
	await generateEventsForOrg(orgId);
	await generateObligationsForOrg(orgId);
}
