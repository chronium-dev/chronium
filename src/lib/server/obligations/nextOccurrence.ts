import type { RecurrenceRule } from '$lib/server/obligations/types';
import { addDays, addMonths, addWeeks, addYears } from 'date-fns';

export function nextOccurrence(date: Date, rule: RecurrenceRule): Date {
	switch (rule.frequency) {
		case 'daily':
			return addDays(date, rule.interval);

		case 'weekly':
			return addWeeks(date, rule.interval);

		case 'monthly':
			return addMonths(date, rule.interval);

		case 'yearly':
			return addYears(date, rule.interval);

		default:
			throw new Error('Unsupported recurrence frequency');
	}
}
