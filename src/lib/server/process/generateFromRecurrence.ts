// recurrence.ts

import type { RecurrenceRule } from '$lib/types/rules';
import { UTCDate } from '@date-fns/utc';
import { addMonths, addWeeks, addYears, isBefore } from 'date-fns';

// type RecurrenceRule = {
// 	frequency: 'monthly' | 'quarterly' | 'yearly';
// 	interval: number;
// 	anchorDate: Date;
// 	dayOfMonth?: number | null;
// 	monthOfYear?: number | null;
// 	endOfMonth?: boolean | null;
// };

export function generateFromRecurrence(
	rule: RecurrenceRule,
	from: UTCDate,
	to: UTCDate
): UTCDate[] {
	const results: UTCDate[] = [];

	let current = new UTCDate(rule.anchorDate);

	while (isBefore(current, to) || current.getTime() === to.getTime()) {
		if (!isBefore(current, from)) {
			results.push(adjustDate(current, rule));
		}

		current = increment(current, rule);
	}

	return results;
}

function increment(date: UTCDate, rule: RecurrenceRule): UTCDate {
	switch (rule.frequency) {
		case 'weekly':
			return addWeeks(date, rule.interval);

		case 'monthly':
			return addMonths(date, rule.interval);

		case 'quarterly':
			return addMonths(date, 3 * rule.interval);

		case 'yearly':
			return addYears(date, rule.interval);
	}
}

function adjustDate(date: UTCDate, rule: RecurrenceRule): UTCDate {
	const d = new UTCDate(date);

	if (rule.monthOfYear) {
		d.setMonth(rule.monthOfYear - 1);
	}

	if (rule.endOfMonth) {
		d.setMonth(d.getMonth() + 1, 0);
	} else if (rule.dayOfMonth) {
		d.setDate(rule.dayOfMonth);
	}

	return d;
}
