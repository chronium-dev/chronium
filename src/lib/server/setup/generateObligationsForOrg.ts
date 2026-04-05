import { getExecutor, type DBExecutor } from '$lib/server/db';
import { events, obligations, ObligationStatusType } from '$lib/server/db/schema';
import type { DateOperationPipeline, ObligationTemplate } from '$lib/types/obligationTemplates';
import type { Organisation } from '$lib/types/organisations';
import { addDays, addMonths, addYears, endOfMonth } from 'date-fns';
import { inArray } from 'drizzle-orm';

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

	// ✅ 1. First occurrence operations (highest priority)
	if (isFirst && template.firstOccurrenceOperations?.length) {
		return applyOperations(baseDate, template.firstOccurrenceOperations);
	}

	// ✅ 2. Standard operations
	if (template.dueDateOperations?.length) {
		return applyOperations(baseDate, template.dueDateOperations);
	}

	// ✅ 3. Legacy fallback (your existing logic)
	const years = isFirst
		? (template.firstOccurrenceYears ?? template.dueOffsetYears ?? 0)
		: (template.dueOffsetYears ?? 0);

	const months = isFirst
		? (template.firstOccurrenceMonths ?? template.dueOffsetMonths ?? 0)
		: (template.dueOffsetMonths ?? 0);

	const days = isFirst
		? (template.firstOccurrenceDays ?? template.dueOffsetDays ?? 0)
		: (template.dueOffsetDays ?? 0);

	return applyDateOffsets(baseDate, years, months, days);
}

export async function generateObligationsForOrg(
	org: Organisation,
	userId: string,
	tx?: DBExecutor
) {
	const exec = getExecutor(tx);

	// 🔑 1. Load templates
	const templates = await exec.query.obligationTemplates.findMany();

	// 🧠 Group templates by eventTypeId
	const templatesByEventType = new Map<string, typeof templates>();
	for (const t of templates) {
		if (!templatesByEventType.has(t.triggerEventTypeId)) {
			templatesByEventType.set(t.triggerEventTypeId, []);
		}
		templatesByEventType.get(t.triggerEventTypeId)!.push(t);
	}

	// 🔑 2. Load ALL events for org (not just unprocessed)
	const allEvents = await exec.query.events.findMany({
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
		const firstEvent = sortedEvents[0];

		const rowsToInsert = [];
		const processedEventIds: string[] = [];

		// 🔁 Process each event
		for (const event of sortedEvents) {
			const isFirst = event.id === firstEvent.id;

			for (const template of templatesForEvent) {
				// 🧠 Due date
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

			// ✅ Mark event as processed (optional now because obligationsGeneratedAt is not used currently...)
			processedEventIds.push(event.id);
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

		if (processedEventIds.length > 0) {
			await exec
				.update(events)
				.set({ obligationsGeneratedAt: new Date() })
				.where(inArray(events.id, processedEventIds));
		}
	}
}
