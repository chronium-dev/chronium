import { getFirstFyeAfterIncorporation } from '$lib/server/process/utils/getFirstFyeAfterIncorporation';
import type { Organisation } from '$lib/types/organisations';
import { UTCDate } from '@date-fns/utc';
import { isBefore } from 'date-fns';

export function getAccountingPeriodEnds(org: Organisation, from: Date, to: Date): Date[] {
	const results: Date[] = [];

	const incorporation = new UTCDate(org.incorporationDate);

	let cursor = getFirstFyeAfterIncorporation(org);

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
