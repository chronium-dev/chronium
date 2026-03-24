// src/lib/server/engine/generateEvents.ts

import { addMonths, addYears } from 'date-fns';
import { db } from '$lib/server/db';
import { events } from '$lib/server/db/schema';

export async function generateEventsForOrg(orgId: string, monthsAhead = 24) {
	const rules = await db.query.recurrenceRules.findMany({
		where: (r, { eq }) => eq(r.organisationId, orgId)
	});

	const now = new Date();
	const end = addMonths(now, monthsAhead);

	for (const rule of rules) {
		let current = new Date(rule.startDate);

		while (current <= end) {
			await db
				.insert(events)
				.values({
					organisationId: orgId,
					eventTypeId: rule.eventTypeId,
					eventDate: current,
					generated: true
				})
				.onConflictDoNothing();

			// increment
			if (rule.frequency === 'monthly') {
				current = addMonths(current, rule.interval);
			} else if (rule.frequency === 'yearly') {
				current = addYears(current, rule.interval);
			}
		}
	}
}
