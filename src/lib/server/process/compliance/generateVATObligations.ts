import type { GeneratedObligation } from '$lib/types/obligations';
import type { Organisation } from '$lib/types/organisations';
import { UTCDate } from '@date-fns/utc';
import { addDays, addMonths } from 'date-fns';

export function generateVATObligations(
	org: Organisation,
	from: Date,
	to: Date
): GeneratedObligation[] {
	if (!org.vatRegistered) return [];

	const obligations: GeneratedObligation[] = [];

	if (!org.vatStartDate) return obligations;

	let cursor = new UTCDate(org.vatStartDate);

	while (cursor <= to) {
		if (cursor >= from) {
			const due = addDays(addMonths(cursor, 1), 7);

			obligations.push({
				key: 'vat_return',
				dueDate: due
			});

			obligations.push({
				key: 'vat_payment',
				dueDate: due
			});
		}

		// Advance period
		if (org.vatFrequency === 'monthly') {
			cursor = addMonths(cursor, 1);
		} else if (org.vatFrequency === 'quarterly') {
			cursor = addMonths(cursor, 3);
		} else {
			cursor = addMonths(cursor, 12);
		}
	}

	return obligations;
}
