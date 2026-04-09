import { UTCDate } from '@date-fns/utc';
import { lastDayOfMonth, set } from 'date-fns';

/**
 * Creates a Date object from year, month, and day.
 * If day is 0, returns the last day of the specified month.
 * * @param year - The full year (e.g., 2026)
 * @param month - The month (1-12)
 * @param day - The day of the month (0 to 31)
 */
export function getCustomDate(year: number, month: number, day: number): Date {
	const baseDate = new UTCDate(year, month, 1);

	if (day === 0) {
		return lastDayOfMonth(baseDate);
	}

	// If day is not 0, set the specific day
	return set(baseDate, { date: day });
}

// Example usage:
// console.log(getCustomDate(2026, 2, 0).toISOString()); // 2026-02-28...
// console.log(getCustomDate(2026, 2, 15).toISOString()); // 2026-02-15...
