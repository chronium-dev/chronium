import type { GeneratedObligation } from '$lib/types/obligations';
import type { Organisation } from '$lib/types/organisations';
import { addCalendarMonths, addMonthAndWeek } from '$lib/utils/dates';
import { UTCDate } from '@date-fns/utc';

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
			const due = addMonthAndWeek(cursor);

			obligations.push({
				key: 'vat_return_and_payment',
				dueDate: due,
				eventDate: cursor
			});
		}

		// Step forward based on frequency
		switch (org.vatFrequency) {
			case 'monthly':
				cursor = addCalendarMonths(cursor, 1);
				break;

			case 'quarterly':
				cursor = addCalendarMonths(cursor, 3);
				break;

			case 'annual':
				cursor = addCalendarMonths(cursor, 12);
				break;
		}
	}

	return obligations;
}
