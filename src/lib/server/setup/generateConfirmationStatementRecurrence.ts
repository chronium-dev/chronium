// generateConfirmationStatement.ts

import { db } from '$lib/server/db';
import { eventTypes, recurrenceRules } from '$lib/server/db/schema';
import { addYears, subDays } from 'date-fns';
import { eq } from 'drizzle-orm';

export async function generateConfirmationStatementRecurrence(org: any) {
	const eventType = await db.query.eventTypes.findFirst({
		where: eq(eventTypes.key, 'confirmation_statement_period_end')
	});

	if (!eventType) {
		throw new Error('Confirmation statement event type missing');
	}

	const incorporationDate = new Date(org.incorporationDate);

	const firstPeriodEnd = subDays(addYears(incorporationDate, 1), 1);

	await db.insert(recurrenceRules).values({
		organisationId: org.id,
		eventTypeId: eventType.id,
		name: 'Confirmation Statement Period End',
		startDate: firstPeriodEnd,
		frequency: 'yearly',
		interval: 1
	});
}
