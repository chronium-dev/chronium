// generateAccountingRecurrence.ts

import { getExecutor, type DBExecutor } from '$lib/server/db';
import { eventTypes, recurrenceRules } from '$lib/server/db/schema';
import { getFirstAccountingPeriodEnd } from '$lib/server/setup/getFirstAccountingPeriodEnd';
import { getRelevantAccountingPeriodEnd } from '$lib/server/setup/getRelevantAccountingPeriodEnd';
import type { Organisation } from '$lib/types/organisations';
import { getCustomDate } from '$lib/utils/dates';
import { eq } from 'drizzle-orm';

export async function generateAccountingRecurrence(org: Organisation, tx?: DBExecutor) {
	const db = getExecutor(tx);

	const accountingEventType = await db.query.eventTypes.findFirst({
		where: eq(eventTypes.key, 'accounting_period_end')
	});

	const ctEventType = await db.query.eventTypes.findFirst({
		where: eq(eventTypes.key, 'corporation_tax_period_end')
	});

	if (!accountingEventType || !ctEventType) {
		throw new Error('Missing accounting_period_end or corporation_tax_period_end event types');
	}

	// const now = new Date();

	// let year = now.getFullYear();

	// let fyEnd = getCustomDate(year, org.financialYearEndMonth, org.financialYearEndDay);

	// if (fyEnd <= now) {
	// 	fyEnd = getCustomDate(year + 1, org.financialYearEndMonth, org.financialYearEndDay);
	// }
	const accountingAnchor = getRelevantAccountingPeriodEnd(org);

	// 🔵 Accounting period
	await db
		.insert(recurrenceRules)
		.values({
			organisationId: org.id,
			eventTypeId: accountingEventType.id,
			name: 'Accounting Period End',
			startDate: accountingAnchor,
			monthDay: org.financialYearEndDay,
			month: org.financialYearEndMonth,
			frequency: 'yearly',
			interval: 1
		})
		.onConflictDoNothing();

	// 🟢 Corporation tax period (same dates for now)
	await db
		.insert(recurrenceRules)
		.values({
			organisationId: org.id,
			eventTypeId: ctEventType.id,
			name: 'Corporation Tax Period End',
			startDate: accountingAnchor,
			monthDay: org.financialYearEndDay,
			month: org.financialYearEndMonth,
			frequency: 'yearly',
			interval: 1
		})
		.onConflictDoNothing();
}
