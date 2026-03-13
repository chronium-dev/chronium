import { db } from '$lib/server/db';
import { recurrenceRules } from '$lib/server/db/schema';
import { addMonths, startOfDay } from 'date-fns';

async function ensureTimelineHorizon() {
	//const horizon = addMonths(new Date(), 24);
	// 1. Get your "Horizon" but strip the time off it immediately.
	// This turns "Today at 12:18 PM" into "Today at 00:00:00"
	const horizonDate = startOfDay(addMonths(new Date(), 24));

	const rules = await db.select().from(recurrenceRules);

	// for (const rule of rules) {
	// 	const last = await db.query.obligations.findFirst({
	// 		where: eq(obligations.generatedFromRecurrenceRuleId, rule.id),
	// 		orderBy: desc(obligations.dueDate)
	// 	});

	// 	let nextDate = parseISO(last ? nextOccurrence(last.dueDate, rule) : rule.startDate);

	// 	while (nextDate <= horizonDate) {
	// 		await db
	// 			.insert(obligations)
	// 			.values({
	// 				organisationId: rule.organisationId,
	// 				obligationTypeId: rule.obligationTypeId,
	// 				generatedFromRecurrenceRuleId: rule.id,
	// 				dueDate: nextDate
	// 			})
	// 			.onConflictDoNothing();

	// 		nextDate = nextOccurrence(nextDate, rule);
	// 	}
	// }
}
function nextOccurrence(
	dueDate: string,
	rule: {
		id: string;
		organisationId: string;
		obligationTypeId: string;
		name: string;
		startDate: string;
		frequency: string;
		interval: number;
		weekday: number | null;
		createdAt: Date;
	}
) {
	throw new Error('Function not implemented.');
}
