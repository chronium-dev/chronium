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

// Helper to check if a date string (YYYY-MM-DD) is the last day of its month
export const isLastDayOfMonth = (dateStr: string): boolean => {
	const date = new UTCDate(dateStr);
	if (isNaN(date.getTime())) return false;

	// We check the next day. If the month changes, the current date was the last day.
	const nextDay = new UTCDate(date);
	nextDay.setDate(date.getDate() + 1);
	return nextDay.getMonth() !== date.getMonth();
};

/**
 * Checks if a given date is the final day of its month.
 * * @param date - The Date object to check.
 * @returns boolean
 */
export const isLastDayInMonth = (date: UTCDate): boolean => {
	// We create a new date object for the "next day"
	const nextDay = new Date(date.getTime());
	nextDay.setDate(date.getDate() + 1);

	// If the next day's date is 1, then the current date must be the last day
	return nextDay.getDate() === 1;
};

export function normaliseVatEndDate(date: Date): Date {
	return new UTCDate(date.getFullYear(), date.getMonth() + 1, 0);
}