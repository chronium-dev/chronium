// src/lib/server/setup/generateVatRecurrence.ts

import { getExecutor, type DBExecutor } from '$lib/server/db';
import { eventTypes, RecurrenceFrequencyType, recurrenceRules } from '$lib/server/db/schema';
import type { Organisation } from '$lib/types/organisations';
import { endOfMonth } from 'date-fns';
import { eq } from 'drizzle-orm';

type VatQuarterGroup = 'mar' | 'jan' | 'feb';

const quarterMonths: Record<VatQuarterGroup, number[]> = {
	mar: [3, 6, 9, 12],
	jan: [1, 4, 7, 10],
	feb: [2, 5, 8, 11]
};

export async function generateVatRecurrence(org: Organisation, tx?: DBExecutor) {
	const db = getExecutor(tx);

	if (!org.vatRegistered || !org.vatFrequency) return;

	const vatEventType = await db.query.eventTypes.findFirst({
		where: eq(eventTypes.key, 'vat_period_end')
	});

	if (!vatEventType) throw new Error('VAT event type missing');

	// ✅ prevent duplicates
	const existing = await db.query.recurrenceRules.findFirst({
		where: (r, { eq, and }) => and(eq(r.organisationId, org.id), eq(r.eventTypeId, vatEventType.id))
	});

	if (existing) return;

	const baseDate = org.vatStartDate ? new Date(org.vatStartDate) : new Date();

	// 🟢 MONTHLY
	if (org.vatFrequency === 'monthly') {
		await db
			.insert(recurrenceRules)
			.values({
				organisationId: org.id,
				eventTypeId: vatEventType.id,
				name: 'Monthly VAT Period End',
				startDate: endOfMonth(baseDate),
				frequency: RecurrenceFrequencyType.Monthly,
				interval: 1
			})
			.onConflictDoNothing();
		return;
	}

	// 🟡 QUARTERLY
	if (org.vatFrequency === 'quarterly') {
		if (!org.vatQuarterGroup) {
			throw new Error('Quarterly VAT requires vatQuarterGroup');
		}

		const months = quarterMonths[org.vatQuarterGroup as VatQuarterGroup];
		const current = new Date(baseDate);

		let firstPeriodEnd = months
			.map((m) => endOfMonth(new Date(current.getFullYear(), m - 1, 1)))
			.find((date) => date > current); // ✅ FIXED

		if (!firstPeriodEnd) {
			const nextYear = current.getFullYear() + 1;
			firstPeriodEnd = endOfMonth(new Date(nextYear, months[0] - 1, 1));
		}

		await db
			.insert(recurrenceRules)
			.values({
				organisationId: org.id,
				eventTypeId: vatEventType.id,
				name: 'Quarterly VAT Period End',
				startDate: firstPeriodEnd,
				frequency: RecurrenceFrequencyType.Monthly,
				interval: 3
			})
			.onConflictDoNothing();
		return;
	}

	// 🔵 ANNUAL
	if (org.vatFrequency === 'annual') {
		await db
			.insert(recurrenceRules)
			.values({
				organisationId: org.id,
				eventTypeId: vatEventType.id,
				name: 'Annual VAT Period End',
				startDate: endOfMonth(baseDate),
				frequency: RecurrenceFrequencyType.Yearly,
				interval: 1
			})
			.onConflictDoNothing();
	}
}
