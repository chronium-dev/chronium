import type { Organisation } from '$lib/types/organisations';
import { UTCDate } from '@date-fns/utc';
import { isBefore } from 'date-fns';

export function getAccountingPeriodEnds(org: Organisation, from: Date, to: Date): Date[] {
	const results: Date[] = [];

	const incorporation = new UTCDate(org.incorporationDate);

	// Build first FYE
	let firstFye = new UTCDate(
		incorporation.getFullYear(),
		org.financialYearEndMonth - 1,
		org.financialYearEndDay
	);

	// Handle "last day of month"
	if (org.financialYearEndIsLastDay) {
		firstFye = new UTCDate(incorporation.getFullYear(), org.financialYearEndMonth, 0);
	}

	// If incorporation AFTER FYE in that year → next year
	if (incorporation > firstFye) {
		firstFye.setFullYear(firstFye.getFullYear() + 1);
	}

	let cursor = new UTCDate(firstFye);

	while (cursor <= to) {
		// NOTE: inclusive (>= from)
		if (!isBefore(cursor, from)) {
			results.push(new UTCDate(cursor));
		}

		cursor = new UTCDate(cursor);
		cursor.setFullYear(cursor.getFullYear() + 1);
	}

	return results;
}
