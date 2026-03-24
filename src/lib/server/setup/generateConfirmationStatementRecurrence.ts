// generateConfirmationStatement.ts

import { db } from '$lib/server/db';
import { eventTypes, recurrenceRules } from '$lib/server/db/schema';
import type { Organisation } from '$lib/types/organisations';
import { eq } from 'drizzle-orm';

export async function generateConfirmationStatementRecurrence(org: Organisation) {
	const eventType = await db.query.eventTypes.findFirst({
		where: eq(eventTypes.key, 'confirmation_statement_date')
	});

	if (!eventType) {
		throw new Error('Missing confirmation_statement_date event types');
	}

	console.log('org.incorporationDate:', org.incorporationDate);

	await db.insert(recurrenceRules).values({
		organisationId: org.id,
		eventTypeId: eventType.id,
		name: 'Confirmation Statement Date',
		startDate: new Date(org.incorporationDate),
		frequency: 'yearly',
		interval: 1
	});
}
