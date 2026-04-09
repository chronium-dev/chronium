// compliance/confirmationStatement.ts

import type { Organisation } from '$lib/types/organisations';
import { UTCDate } from '@date-fns/utc';
import { addYears } from 'date-fns';

export function generateConfirmationStatementObligations(org: Organisation, from: Date, to: Date): Date[] {
	const results: Date[] = [];

	let anniversary = new UTCDate(org.incorporationDate);

	while (anniversary <= to) {
		if (anniversary >= from) {
			results.push(anniversary);
		}

		anniversary = addYears(anniversary, 1);
	}

	return results;
}
