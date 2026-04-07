import { getExecutor, type DBExecutor } from '$lib/server/db';
import { obligations, ObligationStatusType } from '$lib/server/db/schema';
import type { DateOperationPipeline, ObligationTemplate } from '$lib/types/obligationTemplates';
import type { Organisation } from '$lib/types/organisations';
import { addDays, addMonths, addYears, endOfMonth } from 'date-fns';

const WINDOW_PAST_DAYS = 540;
const TARGET_HORIZON_MONTHS = 24;

export function applyOperations(baseDate: Date, ops: DateOperationPipeline): Date {
	let date = new Date(baseDate);

	for (const op of ops) {
		switch (op.type) {
			case 'add':
				if (op.unit === 'days') date = addDays(date, op.value);
				if (op.unit === 'months') date = addMonths(date, op.value);
				if (op.unit === 'years') date = addYears(date, op.value);
				break;

			case 'end_of_month':
				date = endOfMonth(date);
				break;
		}
	}

	return date;
}

function getFirstOccurrenceThreshold(template: ObligationTemplate, org: Organisation): Date | null {
	if (!template.firstOccurrenceOperations?.length) return null;

	let baseDate: Date | null = null;

	if (template.firstOccurrenceBase === 'incorporation_date') {
		baseDate = new Date(org.incorporationDate);
	}

	if (!baseDate) return null;

	return applyOperations(baseDate, template.firstOccurrenceOperations);
}

function resolveBaseDate(
	eventDate: Date,
	template: ObligationTemplate,
	org: Organisation,
	isFirst: boolean
): Date {
	if (isFirst && template.firstOccurrenceBase === 'incorporation_date') {
		return new Date(org.incorporationDate);
	}

	return new Date(eventDate);
}

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

function applyOffset(
	eventDate: Date,
	template: ObligationTemplate,
	org: Organisation,
	isFirst: boolean
): Date {
	const baseDate = resolveBaseDate(eventDate, template, org, isFirst);

	// ✅ First occurrence
	if (isFirst && template.firstOccurrenceOperations?.length) {
		return applyOperations(baseDate, template.firstOccurrenceOperations);
	}

	// ✅ Standard (always required now)
	if (template.dueDateOperations.length === 0)
		throw new Error(
			`Template "${template.name}" does not have a valid "dueDateOperations" setting.`
		);

	return applyOperations(baseDate, template.dueDateOperations);
}

export async function generateObligationsForOrg(
	org: Organisation,
	userId: string,
	tx?: DBExecutor
) {
	const exec = getExecutor(tx);

	const now = new Date();
	const windowStart = addDays(now, -WINDOW_PAST_DAYS);
	const windowEnd = addMonths(now, TARGET_HORIZON_MONTHS);

	// 🔑 1. Load templates
	const templates = await exec.query.obligationTemplates.findMany();

	// 🧠 Group templates by eventTypeId
	const templatesByEventType = new Map<string, ObligationTemplate[]>();
	for (const t of templates) {
		if (!templatesByEventType.has(t.triggerEventTypeId)) {
			templatesByEventType.set(t.triggerEventTypeId, []);
		}
		templatesByEventType.get(t.triggerEventTypeId)!.push(t);
	}

	// 🔥 2. Load ONLY events in window
	const windowedEvents = await exec.query.events.findMany({
		where: (e, { eq, and, gte, lte }) =>
			and(eq(e.organisationId, org.id), gte(e.eventDate, windowStart), lte(e.eventDate, windowEnd))
	});

	if (windowedEvents.length === 0) return;

	// 🧠 3. Group events by eventTypeId
	const eventsByType = new Map<string, typeof windowedEvents>();
	for (const e of windowedEvents) {
		if (!eventsByType.has(e.eventTypeId)) {
			eventsByType.set(e.eventTypeId, []);
		}
		eventsByType.get(e.eventTypeId)!.push(e);
	}

	// // 🔑 4. Preload TRUE first events (global scope)
	// const trueFirstEventIdByType = new Map<string, string>();

	// for (const eventTypeId of eventsByType.keys()) {
	// 	const first = await exec.query.events.findFirst({
	// 		where: (e, { eq, and }) => and(eq(e.organisationId, org.id), eq(e.eventTypeId, eventTypeId)),
	// 		orderBy: (e, { asc }) => asc(e.eventDate)
	// 	});

	// 	if (first) {
	// 		trueFirstEventIdByType.set(eventTypeId, first.id);
	// 	}
	// }

	// 🔁 5. Process each event stream
	for (const [eventTypeId, eventsForType] of eventsByType.entries()) {
		const templatesForEvent = templatesByEventType.get(eventTypeId);
		if (!templatesForEvent) continue;

		// 📅 Sort events chronologically
		const sortedEvents = [...eventsForType].sort(
			(a, b) => a.eventDate.getTime() - b.eventDate.getTime()
		);

		if (sortedEvents.length === 0) continue;

		// const firstEventInWindow = sortedEvents[0];
		// const trueFirstEventId = trueFirstEventIdByType.get(eventTypeId);

		const rowsToInsert = [];

		for (const template of templatesForEvent) {
			// const scope = template.firstOccurrenceScope ?? 'global';

			const firstThreshold = getFirstOccurrenceThreshold(template, org);
			let firstApplied = false;

			for (const event of sortedEvents) {
				let isFirst = false;

				// if (firstThreshold && !firstApplied && event.eventDate >= firstThreshold) {
				// 	isFirst = true;
				// 	firstApplied = true;
				// }

				const qualifiesForFirst = firstThreshold && event.eventDate >= firstThreshold;
				if (qualifiesForFirst && !firstApplied) {
					isFirst = true;
					firstApplied = true;
				}

				// 🚨 Skip events BEFORE first occurrence
				if (firstThreshold && !firstApplied && event.eventDate < firstThreshold) {
					continue;
				}

				const dueDate = applyOffset(event.eventDate, template, org, isFirst);

				rowsToInsert.push({
					organisationId: org.id,
					obligationTypeId: template.obligationTypeId,
					templateId: template.id,
					generatedFromEventId: event.id,
					dueDate,
					eventDate: event.anchorDate ?? event.eventDate,
					status: ObligationStatusType.Pending,
					assignedToUserId: userId
				});
			}
		}
		if (rowsToInsert.length > 0) {
			const chunkSize = 500;

			for (let i = 0; i < rowsToInsert.length; i += chunkSize) {
				await exec
					.insert(obligations)
					.values(rowsToInsert.slice(i, i + chunkSize))
					.onConflictDoNothing();
			}
		}
	}
}
