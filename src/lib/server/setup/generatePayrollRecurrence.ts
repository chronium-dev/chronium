// generatePayrollRecurrence.ts

import { db } from '$lib/server/db';
import { eventTypes, recurrenceRules } from '$lib/server/db/schema';
import type { Organisation } from '$lib/types/organisations';
import { endOfMonth } from 'date-fns';
import { eq } from 'drizzle-orm';

export async function generatePayrollRecurrence(org: Organisation) {
	if (!org.payrollActive) return;

	const eventType = await db.query.eventTypes.findFirst({
		where: eq(eventTypes.key, 'payroll_month_end')
	});

	if (!eventType) return;

	await db
		.insert(recurrenceRules)
		.values({
			organisationId: org.id,
			eventTypeId: eventType.id,
			name: 'Payroll Month End',
			startDate: endOfMonth(new Date()),
			frequency: 'monthly',
			interval: 1
		})
		.onConflictDoNothing();
}
