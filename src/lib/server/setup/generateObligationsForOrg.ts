import { db } from '$lib/server/db';
import { events, obligations, ObligationStatusType } from '$lib/server/db/schema';
import type { Organisation } from '$lib/types/organisations';
import { addDays, addMonths, addYears } from 'date-fns';
import { eq } from 'drizzle-orm';

/**
 * NB: “Dates are clamped to end-of-month when necessary”
 * ... e.g. Jan 31 + 1 month → Feb 28 ✅ (good)
 *
 */

function applyDateOffsets(baseDate: Date, years?: number, months?: number, days?: number): Date {
	let date = new Date(baseDate);

	if (years) {
		date = addYears(date, years);
	}

	if (months) {
		date = addMonths(date, months);
	}

	if (days) {
		date = addDays(date, days);
	}

	return date;
}

function applyOffset(eventDate: Date, template: any, org: any, isFirst: boolean): Date {
	// ✅ FIRST OCCURRENCE OVERRIDE?
	const hasOverride =
		template.firstOccurrenceMonths != null ||
		template.firstOccurrenceDays != null ||
		template.firstOccurrenceYears != null;

	if (isFirst && hasOverride) {
		let baseDate: Date;

		if (template.firstOccurrenceBase === 'incorporation_date') {
			baseDate = new Date(org.incorporationDate);
		} else {
			baseDate = new Date(eventDate);
		}

		return applyDateOffsets(
			baseDate,
			template.firstOccurrenceYears,
			template.firstOccurrenceMonths,
			template.firstOccurrenceDays
		);
	}

	// ✅ STANDARD CASE
	return applyDateOffsets(
		new Date(eventDate),
		template.dueOffsetYears,
		template.dueOffsetMonths,
		template.dueOffsetDays
	);
}

export async function generateObligationsForOrg(org: Organisation, userId: string) {
	// 🔑 1. Load templates
	const templates = await db.query.obligationTemplates.findMany();

	// 🧠 Group templates by eventTypeId
	const templatesByEventType = new Map<string, typeof templates>();

	for (const t of templates) {
		if (!templatesByEventType.has(t.triggerEventTypeId)) {
			templatesByEventType.set(t.triggerEventTypeId, []);
		}
		templatesByEventType.get(t.triggerEventTypeId)!.push(t);
	}

	// 🔑 2. Load ALL events for org (not just unprocessed)
	const allEvents = await db.query.events.findMany({
		where: (e, { eq }) => eq(e.organisationId, org.id)
	});

	// 🧠 3. Group events by eventTypeId (i.e. event stream)
	const eventsByType = new Map<string, typeof allEvents>();

	for (const e of allEvents) {
		if (!eventsByType.has(e.eventTypeId)) {
			eventsByType.set(e.eventTypeId, []);
		}
		eventsByType.get(e.eventTypeId)!.push(e);
	}

	// 🔁 4. Process each event stream independently
	for (const [eventTypeId, eventsForType] of eventsByType.entries()) {
		const templatesForEvent = templatesByEventType.get(eventTypeId);
		if (!templatesForEvent) continue;

		// 📅 Sort events chronologically
		const sortedEvents = [...eventsForType].sort(
			(a, b) => a.eventDate.getTime() - b.eventDate.getTime()
		);

		// 🥇 Determine TRUE first event (deterministic)
		const firstEventDate = sortedEvents[0].eventDate;

		// 🔁 Process each event
		for (const event of sortedEvents) {
			const isFirst = event.eventDate.getTime() === firstEventDate.getTime();

			for (const template of templatesForEvent) {
				// 🧠 Due date
				const dueDate = applyOffset(event.eventDate, template, org, isFirst);

				await db
					.insert(obligations)
					.values({
						organisationId: org.id,
						obligationTypeId: template.obligationTypeId,
						templateId: template.id,
						generatedFromEventId: event.id,
						dueDate,
						eventDate: event.anchorDate ?? event.eventDate,
						status: ObligationStatusType.Pending,
						assignedToUserId: userId
					})
					.onConflictDoNothing();
			}

			// ✅ Mark event as processed (optional now becuase obligationsGeneratedAt is not used currently...)
			await db
				.update(events)
				.set({ obligationsGeneratedAt: new Date() })
				.where(eq(events.id, event.id));
		}
	}
}
