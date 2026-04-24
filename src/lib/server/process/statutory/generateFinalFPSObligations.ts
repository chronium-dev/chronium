import type { GeneratedObligation } from '$lib/types/obligations';
import type { Organisation } from '$lib/types/organisations';
import { UTCDate } from '@date-fns/utc';
import { setDate } from 'date-fns';

export function generateFinalFPSObligations(
	org: Organisation,
	from: Date,
	to: Date
): GeneratedObligation[] {
	if (!org.payrollActive) return [];

	const obligations: GeneratedObligation[] = [];

	let year = from.getFullYear() - 1;

	while (true) {
		// Tax year ends 5 April
		const taxYearEnd = new UTCDate(year, 3, 5); // April = 3
		const dueDate = setDate(taxYearEnd, 22);

		if (taxYearEnd > to) break;

		if (taxYearEnd >= from) {
			obligations.push({
				key: 'final_fps',
				dueDate: dueDate,
				eventDate: taxYearEnd
			});
		}

		year++;
	}

	return obligations;
}
