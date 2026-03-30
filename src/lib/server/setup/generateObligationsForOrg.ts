import { db } from '$lib/server/db';
import { events, obligations, ObligationStatusType } from '$lib/server/db/schema';
import { addDays, addMonths, addYears } from 'date-fns';
import { and, desc, eq } from 'drizzle-orm';

function applyOffset(eventDate: Date, template: any, isFirst: boolean): Date {
	// ✅ First occurrence override
	if (isFirst && template.firstOccurrenceOffsetDays != null) {
		return addDays(eventDate, template.firstOccurrenceOffsetDays);
	}

	// ✅ Standard offsets
	if (template.dueOffsetDays != null) {
		return addDays(eventDate, template.dueOffsetDays);
	}

	if (template.dueOffsetMonths != null) {
		return addMonths(eventDate, template.dueOffsetMonths);
	}

	if (template.dueOffsetYears != null) {
		return addYears(eventDate, template.dueOffsetYears);
	}

	return eventDate;
}

export async function generateObligationsForOrg(orgId: string, userId: string) {
	// 🔑 1. Load templates
	const templates = await db.query.obligationTemplates.findMany();

	// 🧠 Group templates by eventTypeId
	const templatesByEventType = new Map<string, typeof templates>();

	for (const t of templates) {
		if (!templatesByEventType.has(t.eventTypeId)) {
			templatesByEventType.set(t.eventTypeId, []);
		}
		templatesByEventType.get(t.eventTypeId)!.push(t);
	}

	// 🔑 2. Load events for org
	// Only fetch unprocessed events
	const unprocessedEvents = await db.query.events.findMany({
		where: (e, { eq, isNull }) => and(eq(e.organisationId, orgId), isNull(e.obligationsGeneratedAt))
	});

	for (const event of unprocessedEvents) {
		const templatesForEvent = templatesByEventType.get(event.eventTypeId);

		if (!templatesForEvent) continue;

		for (const template of templatesForEvent) {
			// 🔐 Idempotency check
			const existing = await db.query.obligations.findFirst({
				where: (o, { and, eq }) =>
					and(eq(o.generatedFromEventId, event.id), eq(o.templateId, template.id))
			});

			if (existing) continue;

			// 🔍 First occurrence check (per eventType + asset)
			const priorEvent = await db.query.events.findFirst({
				where: (e, { and, eq, lt }) =>
					and(
						eq(e.organisationId, orgId),
						eq(e.eventTypeId, event.eventTypeId),
						lt(e.eventDate, event.eventDate)
					),
				orderBy: (e) => desc(e.eventDate)
			});

			const isFirst = !priorEvent;

			// 🧠 Due date
			const dueDate = applyOffset(event.eventDate, template, isFirst);

			await db
				.insert(obligations)
				.values({
					organisationId: orgId,
					obligationTypeId: template.obligationTypeId,
					templateId: template.id,
					generatedFromEventId: event.id,
					dueDate,
					status: ObligationStatusType.Pending,
					assignedToUserId: userId
				})
				.onConflictDoNothing();
		}
		// ✅ Mark event as processed
		await db
			.update(events)
			.set({ obligationsGeneratedAt: new Date() })
			.where(eq(events.id, event.id));
	}
}
