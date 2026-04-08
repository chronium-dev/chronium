// recurrence.ts

import type { RecurrenceRule } from '$lib/types/rules';
import { addMonths, addWeeks, addYears, isAfter, isBefore } from 'date-fns';

// type RecurrenceRule = {
// 	frequency: 'monthly' | 'quarterly' | 'yearly';
// 	interval: number;
// 	anchorDate: Date;
// 	dayOfMonth?: number | null;
// 	monthOfYear?: number | null;
// 	endOfMonth?: boolean | null;
// };

export function generateFromRecurrence(rule: RecurrenceRule, from: Date, to: Date): Date[] {
	const results: Date[] = [];

	let current = new Date(rule.anchorDate);

	while (isBefore(current, to) || current.getTime() === to.getTime()) {
		if (!isBefore(current, from)) {
			results.push(adjustDate(current, rule));
		}

		current = increment(current, rule);
	}

	return results;
}

function increment(date: Date, rule: RecurrenceRule): Date {
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

function adjustDate(date: Date, rule: RecurrenceRule): Date {
	const d = new Date(date);

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
