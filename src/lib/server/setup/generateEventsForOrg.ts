import { db } from '$lib/server/db';
import { events, organisation } from '$lib/server/db/schema';
import { addMonths, addYears, isAfter } from 'date-fns';
import { desc, eq } from 'drizzle-orm';

const TARGET_HORIZON_MONTHS = Number.parseInt(process.env.TARGET_HORIZON_MONTHS ?? '24');

/**
 * NB: “Dates are clamped to end-of-month when necessary”
 * ... e.g. Jan 31 + 1 month → Feb 28 ✅ (good)
 * 
 */

function getNextDate(current: Date, rule: any): Date {
	if (rule.frequency === 'monthly') {
		return addMonths(current, rule.interval);
	}

	if (rule.frequency === 'yearly') {
		return addYears(current, rule.interval);
	}

	throw new Error(`Unsupported frequency: ${rule.frequency}`);
}

export async function generateEventsForOrg(orgId: string) {
	const now = new Date();

	// 🔑 Load organisation horizon
	const org = await db.query.organisation.findFirst({
		where: (o, { eq }) => eq(o.id, orgId)
	});

	if (!org) throw new Error('Organisation not found');

	const currentHorizon = org.obligationGenerationHorizon ?? now;
	const targetHorizon = addMonths(now, TARGET_HORIZON_MONTHS);

	// ✅ Nothing to do
	if (!isAfter(targetHorizon, currentHorizon)) {
		return;
	}

	// 🔑 Load recurrence rules
	const rules = await db.query.recurrenceRules.findMany({
		where: (r, { eq }) => eq(r.organisationId, orgId)
	});

	for (const rule of rules) {
		// 🔍 Find last generated event for this rule (INCLUDING asset)
		const lastEvent = await db.query.events.findFirst({
			where: (e, { and, eq, isNull }) =>
				and(
					eq(e.organisationId, orgId),
					eq(e.eventTypeId, rule.eventTypeId)
				),
			orderBy: (e) => desc(e.eventDate)
		});

		let current: Date;

		if (lastEvent) {
			// ✅ Continue sequence correctly
			current = getNextDate(lastEvent.eventDate, rule);
		} else {
			// ✅ First generation
			current = new Date(rule.startDate);
		}

		while (current <= targetHorizon && (!rule.endDate || current <= rule.endDate)) {
			await db
				.insert(events)
				.values({
					organisationId: orgId,
					eventTypeId: rule.eventTypeId,
					eventDate: current,
					//generated: true
				})
				.onConflictDoNothing();

			current = getNextDate(current, rule);
		}
	}

	// 🔐 Advance horizon (THIS is what prevents reprocessing)
	await db
		.update(organisation)
		.set({
			obligationGenerationHorizon: targetHorizon
		})
		.where(eq(organisation.id, orgId));
}
