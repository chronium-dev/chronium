import type { GeneratedObligation } from '$lib/types/obligations';
import type { Organisation } from '$lib/types/organisations';
import { UTCDate } from '@date-fns/utc';
import { addDays, addYears } from 'date-fns';

export function generateConfirmationStatementObligations(
	org: Organisation,
	from: Date,
	to: Date
): GeneratedObligation[] {
	const obligations: GeneratedObligation[] = [];

	const incorporation = new UTCDate(org.incorporationDate);

	let cursor = addYears(addDays(incorporation, 14), 1);

	while (cursor <= to) {
		if (cursor >= from) {
			obligations.push({
				key: 'confirmation_statement',
				dueDate: cursor
			});
		}

		cursor = addYears(cursor, 1);
	}

	return obligations;
}
