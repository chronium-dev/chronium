// src/lib/server/engine/generateEvents.ts

import { db } from '$lib/server/db';
import { events, organisation } from '$lib/server/db/schema';
import { addMonths, addYears, max } from 'date-fns';
import { eq } from 'drizzle-orm';
// import { events, organisations } from '$lib/server/db/schema';

const TARGET_HORIZON_MONTHS = Number.parseInt(process.env.TARGET_HORIZON_MONTHS || '24');

export async function generateEventsForOrg(orgId: string) {
	// 1. Load organisation
	const org = await db.query.organisation.findFirst({
		where: (o, { eq }) => eq(o.id, orgId)
	});

	if (!org) throw new Error('Organisation not found');

	// 2. Calculate boundaries
	const now = new Date();

	const targetHorizon = addMonths(now, TARGET_HORIZON_MONTHS);

	const currentHorizon = org.obligationGenerationHorizon ?? now;

	// ✅ Nothing to do
	if (currentHorizon >= targetHorizon) return;

	// 3. Load recurrence rules
	const rules = await db.query.recurrenceRules.findMany({
		where: (r, { eq }) => eq(r.organisationId, orgId)
	});

	// 4. Generate incrementally
	for (const rule of rules) {
		// Start from the later of:
		// - rule.startDate
		// - current horizon
		let current = max([new Date(rule.startDate), currentHorizon]);

		while (current <= targetHorizon) {
			await db
				.insert(events)
				.values({
					organisationId: orgId,
					eventTypeId: rule.eventTypeId,
					eventDate: current,
					generated: true
					// 🔜 add assetId here later
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

	// 5. Advance horizon (CRITICAL)
	await db
		.update(organisation)
		.set({
			obligationGenerationHorizon: targetHorizon
		})
		.where(eq(organisation.id, orgId));
}

// // src/lib/server/engine/generateEvents.ts

// import { addMonths, addYears } from 'date-fns';
// import { db } from '$lib/server/db';
// import { events } from '$lib/server/db/schema';

// const monthsAhead = Number.parseInt(process.env.TARGET_HORIZON_MONTHS!);

// export async function generateEventsForOrg(
// 	orgId: string
// ) {
// 	const rules = await db.query.recurrenceRules.findMany({
// 		where: (r, { eq }) => eq(r.organisationId, orgId)
// 	});

// 	const now = new Date();
// 	const end = addMonths(now, monthsAhead);

// 	for (const rule of rules) {
// 		let current = new Date(rule.startDate);

// 		while (current <= end) {
// 			await db
// 				.insert(events)
// 				.values({
// 					organisationId: orgId,
// 					eventTypeId: rule.eventTypeId,
// 					eventDate: current,
// 					generated: true
// 				})
// 				.onConflictDoNothing();

// 			// increment
// 			if (rule.frequency === 'monthly') {
// 				current = addMonths(current, rule.interval);
// 			} else if (rule.frequency === 'yearly') {
// 				current = addYears(current, rule.interval);
// 			}
// 		}
// 	}
// }
