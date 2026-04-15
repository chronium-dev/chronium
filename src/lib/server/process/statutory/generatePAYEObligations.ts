import type { GeneratedObligation } from '$lib/types/obligations';
import type { Organisation } from '$lib/types/organisations';
import { getFiscalQuarterInfo } from '$lib/utils/dates';
import { UTCDate } from '@date-fns/utc';
import { addMonths, setDate, startOfMonth } from 'date-fns';

/**
 * 
Payment Frequencies:

Monthly (Standard):
This is the default for most businesses.

You must pay by the 22nd of the following tax month if paying electronically (or the 19th if paying by post).
A tax month runs from the 6th of one month to the 5th of the next.

Quarterly (Small Employers):
You can choose this if your average monthly PAYE and National Insurance bill is less than £1,500.

Payments are due by the 22nd (electronic) or 19th (post) after the end of each quarter:

Quarter 1 (6 Apr – 5 Jul): Due 22 July.
Quarter 2 (6 Jul – 5 Oct): Due 22 October.
Quarter 3 (6 Oct – 5 Jan): Due 22 January.
Quarter 4 (6 Jan – 5 Apr): Due 22 April.
 */

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

	// Move to next period (first PAYE period)
	switch (org.payeFrequency) {
		case 'monthly':
			cursor = addMonths(cursor, 1);
			break;
		case 'quarterly':
			const quarterInfo = getFiscalQuarterInfo(cursor);
			cursor = startOfMonth(quarterInfo.endDate);
			break;
	}

	while (cursor <= to) {
		// PAYE payment due = 22nd of following month
		// const due = setDate(addMonths(cursor, 1), 22);
		const due = setDate(cursor, 22);

		// Only save date if within processing date window
		if (due >= from && due <= to) {
			obligations.push({
				key: 'paye_payment',
				dueDate: due
			});
		}

		switch (org.payeFrequency) {
			case 'monthly':
				cursor = addMonths(cursor, 1);
				break;
			case 'quarterly':
				cursor = addMonths(cursor, 3);
				break;
		}
	}

	return obligations;
}
