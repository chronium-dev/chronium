import { getExecutor, type DBExecutor } from '$lib/server/db';
import { events, RecurrenceFrequencyType } from '$lib/server/db/schema';
import type { RecurrenceRule } from '$lib/types/rules';
import { addDays, addMonths, addYears } from 'date-fns';

const WINDOW_PAST_DAYS = 540; // ~18 months
const TARGET_HORIZON_MONTHS = 24;

/**
 * NB: “Dates are clamped to end-of-month when necessary”
 * ... e.g. Jan 31 + 1 month → Feb 28 ✅
 */

function getNextDate(current: Date, rule: RecurrenceRule): Date {
	if (rule.frequency === RecurrenceFrequencyType.Monthly) {
		return addMonths(current, rule.interval);
	}

	if (rule.frequency === RecurrenceFrequencyType.Yearly) {
		return addYears(current, rule.interval);
	}

	throw new Error(`Unsupported frequency: ${rule.frequency}`);
}

export async function generateEventsForOrg(orgId: string, tx?: DBExecutor) {
	const db = getExecutor(tx);

	const now = new Date();
	const windowStart = addDays(now, -WINDOW_PAST_DAYS);
	const windowEnd = addMonths(now, TARGET_HORIZON_MONTHS);

	// 🔑 Load recurrence rules
	const rules = await db.query.recurrenceRules.findMany({
		where: (r, { eq }) => eq(r.organisationId, orgId)
	});

	for (const rule of rules) {
		let currentDate = new Date(rule.startDate);

		// 🔥 Fast-forward to near windowStart (avoid unnecessary looping)
		while (currentDate < windowStart) {
			const next = getNextDate(currentDate, rule);

			// Stop just before we enter the window
			if (next >= windowStart) break;

			currentDate = next;
		}

		// 🔁 Generate events within window
		while (currentDate <= windowEnd && (!rule.endDate || currentDate <= rule.endDate)) {
			// Only insert if inside window
			if (currentDate >= windowStart) {
				await db
					.insert(events)
					.values({
						organisationId: orgId,
						eventTypeId: rule.eventTypeId,
						eventDate: currentDate
					})
					.onConflictDoNothing();
			}

			currentDate = getNextDate(currentDate, rule);
		}
	}
}
