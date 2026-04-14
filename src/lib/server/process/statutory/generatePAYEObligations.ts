import type { GeneratedObligation } from '$lib/types/obligations';
import type { Organisation } from '$lib/types/organisations';
import { UTCDate } from '@date-fns/utc';
import { addMonths, setDate } from 'date-fns';

export function generatePAYEObligations(
	org: Organisation,
	from: Date,
	to: Date
): GeneratedObligation[] {
	if (!org.payrollActive) return [];

	const obligations: GeneratedObligation[] = [];

	const incorporation = new UTCDate(org.incorporationDate);

	// Start from first month after incorporation
	let cursor = new UTCDate(incorporation.getFullYear(), incorporation.getMonth(), 1);

	// Move to next month (first PAYE period)
	cursor = addMonths(cursor, 1);

	while (cursor <= to) {
		// PAYE payment due = 22nd of following month
		const due = setDate(addMonths(cursor, 1), 22);

		if (due >= from && due <= to) {
			obligations.push({
				key: 'paye_payment',
				dueDate: due
			});
		}

		cursor = addMonths(cursor, 1);
	}

	return obligations;
}
