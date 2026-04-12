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
	if (!org.vatFrequency) return [];
	if (!org.vatEndDate) return [];

	const obligations: GeneratedObligation[] = [];

	let cursor = new UTCDate(org.vatEndDate);

	while (cursor <= to) {
		if (cursor >= from) {
			const due = addDays(addMonths(cursor, 1), 7);

			obligations.push({ key: 'vat_return', dueDate: due }, { key: 'vat_payment', dueDate: due });
		}

		// Step forward based on frequency
		switch (org.vatFrequency) {
			case 'monthly':
				cursor = addMonths(cursor, 1);
				break;

			case 'quarterly':
				cursor = addMonths(cursor, 3);
				break;

			case 'annual':
				cursor = addMonths(cursor, 12);
				break;
		}
	}

	return obligations;
}
