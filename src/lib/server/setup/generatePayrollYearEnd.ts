import { db } from '$lib/server/db';
import { eventTypes, recurrenceRules } from '$lib/server/db/schema';
import type { Organisation } from '$lib/types/organisations';
import { eq } from 'drizzle-orm';

export async function generatePayrollYearEnd(org: Organisation) {
	if (!org.payrollActive) return;

	const eventType = await db.query.eventTypes.findFirst({
		where: eq(eventTypes.key, 'payroll_year_end')
	});

	if (!eventType) return;

	// UK tax year ends April 5th
	const now = new Date();
	let year = now.getFullYear();

	let taxYearEnd = new Date(year, 3, 5); // April = 3

	if (taxYearEnd < now) {
		taxYearEnd = new Date(year + 1, 3, 5);
	}

	await db.insert(recurrenceRules).values({
		organisationId: org.id,
		eventTypeId: eventType.id,
		name: 'Payroll Year End',
		startDate: taxYearEnd,
		frequency: 'yearly',
		interval: 1
	});
}
