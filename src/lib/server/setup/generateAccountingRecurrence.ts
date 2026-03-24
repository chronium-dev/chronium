// generateAccountingRecurrence.ts

import { db } from '$lib/server/db';
import { eventTypes, recurrenceRules } from '$lib/server/db/schema';
import type { Organisation } from '$lib/types/organisations';
import { eq } from 'drizzle-orm';

export async function generateAccountingRecurrence(org: Organisation) {
	const accountingEventType = await db.query.eventTypes.findFirst({
		where: eq(eventTypes.key, 'accounting_period_end')
	});

	const ctEventType = await db.query.eventTypes.findFirst({
		where: eq(eventTypes.key, 'corporation_tax_period_end')
	});

	if (!accountingEventType || !ctEventType) {
		throw new Error('Missing accounting_period_end or corporation_tax_period_end event types');
	}

	const now = new Date();

	let year = now.getFullYear();

	let fyEnd = new Date(year, org.financialYearEndMonth - 1, org.financialYearEndDay);

	if (fyEnd < now) {
		fyEnd = new Date(year + 1, org.financialYearEndMonth - 1, org.financialYearEndDay);
	}

	// 🔵 Accounting period
	await db.insert(recurrenceRules).values({
		organisationId: org.id,
		eventTypeId: accountingEventType.id,
		name: 'Accounting Period End',
		startDate: fyEnd,
		monthDay: org.financialYearEndDay,
		month: org.financialYearEndMonth,
		frequency: 'yearly',
		interval: 1
	});

	// 🟢 Corporation tax period (same dates for now)
	await db.insert(recurrenceRules).values({
		organisationId: org.id,
		eventTypeId: ctEventType.id,
		name: 'Corporation Tax Period End',
		startDate: fyEnd,
		monthDay: org.financialYearEndDay,
		month: org.financialYearEndMonth,
		frequency: 'yearly',
		interval: 1
	});
}