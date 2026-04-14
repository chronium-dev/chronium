import { getFirstFyeAfterIncorporation } from '$lib/server/process/utils/getFirstFyeAfterIncorporation';
import type { Organisation } from '$lib/types/organisations';
import { normaliseMonthEndDate } from '$lib/utils/dates';
import { UTCDate } from '@date-fns/utc';
import { addYears, isBefore } from 'date-fns';

export function getAccountingPeriodEnds(org: Organisation, from: Date, to: Date): Date[] {
	const results: Date[] = [];

	let cursor = getFirstFyeAfterIncorporation(org);

	while (cursor <= to) {
		// NOTE: inclusive (>= from)
		if (!isBefore(cursor, from)) {
			results.push(new UTCDate(cursor));
		}

		if (org.financialYearEndIsLastDay) {
			// This is to factor in leap years
			cursor = normaliseMonthEndDate(addYears(cursor, 1));
		} else {
			//cursor = new UTCDate(cursor);
			cursor.setFullYear(cursor.getFullYear() + 1);
		}
	}

	return results;
}
