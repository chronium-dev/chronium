import { getAccountingPeriodEnds } from '$lib/server/process/utils/getAccountingPeriodEnds';
import type { GeneratedObligation } from '$lib/types/obligations';
import type { Organisation } from '$lib/types/organisations';
import { addYears, subYears } from 'date-fns';
import { UTCDate } from '@date-fns/utc';

export function generateConfirmationStatementObligations(
	org: Organisation,
	from: Date,
	to: Date
): GeneratedObligation[] {
	const obligations: GeneratedObligation[] = [];

	const incorporation = new UTCDate(org.incorporationDate);

	// 🔑 widen window for safety (same pattern as others)
	const safeFrom = subYears(from, 1);

	let cursor = addYears(incorporation, 1);

	while (cursor <= to) {
		if (cursor >= safeFrom && cursor >= from) {
			obligations.push({
				key: 'confirmation_statement',
				dueDate: cursor
			});
		}

		cursor = addYears(cursor, 1);
	}

	return obligations;
}
