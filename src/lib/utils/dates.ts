import { UTCDate } from '@date-fns/utc';
import { addDays, addMonths, getDaysInMonth, lastDayOfMonth, set } from 'date-fns';

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

export function normaliseMonthEndDate(date: UTCDate): UTCDate {
	return new UTCDate(date.getFullYear(), date.getMonth() + 1, 0);
}

export function addMonthAndWeek(startDate: UTCDate) {
	let result;

	// 1. Check if the input date is the last day of its month
	if (isLastDayInMonth(startDate)) {
		// Move to the next month, then find the last day of THAT month
		const nextMonth = addMonths(startDate, 1);
		result = lastDayOfMonth(nextMonth);
	} else {
		// Otherwise, perform a standard month addition
		result = addMonths(startDate, 1);
	}

	// 2. Add the 7 days to the result
	return addDays(result, 7);
}

export function addCalendarMonths(date: UTCDate, months: number) {
	const utcDate = new UTCDate(date);

	// Manual UTC check: Does the current day equal the total days in this month?
	const isLastDay = utcDate.getUTCDate() === getDaysInMonth(utcDate);

	if (isLastDay) {
		// 1. Move to next month
		// 2. Use lastDayOfMonth to snap to the 30th/31st/28th
		const nextMonth = addMonths(utcDate, months);
		return lastDayOfMonth(nextMonth);
	}

	return addMonths(utcDate, 1);
}

/**
 * Returns the Fiscal Quarter label based on the UK tax year style:
 * Q1: Apr 6 – Jul 5
 * Q2: Jul 6 – Oct 5
 * Q3: Oct 6 – Jan 5
 * Q4: Jan 6 – Apr 5
 */
export function getFiscalQuarterLabel(date: Date | UTCDate): 'Q1' | 'Q2' | 'Q3' | 'Q4' {
	const utcDate = new UTCDate(date);

	// Create a numeric representation: (Month 1-12 * 100) + Day (1-31)
	// e.g., April 6th = 406, January 5th = 105
	const month = utcDate.getUTCMonth() + 1;
	const day = utcDate.getUTCDate();
	const mmdd = month * 100 + day;

	// Q4: Jan 6 (106) to Apr 5 (405)
	if (mmdd >= 106 && mmdd <= 405) {
		return 'Q4';
	}

	// Q1: Apr 6 (406) to Jul 5 (705)
	if (mmdd >= 406 && mmdd <= 705) {
		return 'Q1';
	}

	// Q2: Jul 6 (706) to Oct 5 (1005)
	if (mmdd >= 706 && mmdd <= 1005) {
		return 'Q2';
	}

	// Q3: Oct 6 (1006) to Dec 31 (1231) AND Jan 1 (101) to Jan 5 (105)
	return 'Q3';
}

export interface FiscalQuarterInfo {
	label: 'Q1' | 'Q2' | 'Q3' | 'Q4';
	startDate: UTCDate;
	endDate: UTCDate;
}

export function getFiscalQuarterInfo(date: Date | UTCDate): FiscalQuarterInfo {
	const utcDate = new UTCDate(date);
	const year = utcDate.getUTCFullYear();
	const month = utcDate.getUTCMonth() + 1; // 1-12
	const day = utcDate.getUTCDate();
	const mmdd = month * 100 + day;

	// Q4: Jan 6 – Apr 5
	if (mmdd >= 106 && mmdd <= 405) {
		return {
			label: 'Q4',
			startDate: new UTCDate(year, 0, 6), // Jan 6
			endDate: new UTCDate(year, 3, 5) // Apr 5
		};
	}

	// Q1: Apr 6 – Jul 5
	if (mmdd >= 406 && mmdd <= 705) {
		return {
			label: 'Q1',
			startDate: new UTCDate(year, 3, 6), // Apr 6
			endDate: new UTCDate(year, 6, 5) // Jul 5
		};
	}

	// Q2: Jul 6 – Oct 5
	if (mmdd >= 706 && mmdd <= 1005) {
		return {
			label: 'Q2',
			startDate: new UTCDate(year, 6, 6), // Jul 6
			endDate: new UTCDate(year, 9, 5) // Oct 5
		};
	}

	// Q3: Oct 6 – Jan 5
	// If month is Oct/Nov/Dec (>= 10), start is THIS year, end is NEXT year.
	// If month is Jan (<= 1), start was LAST year, end is THIS year.
	const isLateInYear = month >= 10;
	return {
		label: 'Q3',
		startDate: new UTCDate(isLateInYear ? year : year - 1, 9, 6), // Oct 6
		endDate: new UTCDate(isLateInYear ? year + 1 : year, 0, 5) // Jan 5
	};
}
