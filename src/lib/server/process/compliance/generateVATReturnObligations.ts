// compliance/vatReturns.ts

import type { Organisation } from '$lib/types/organisations';
import { UTCDate } from '@date-fns/utc';
import { addMonths, addDays, isAfter } from 'date-fns';

// type Organisation = {
// 	vatRegistered: boolean;
// 	vatFrequency?: 'quarterly' | 'monthly' | 'annual';
// 	vatQuarterGroup?: 'jan' | 'feb' | 'mar';
// 	vatStartDate?: Date | null;
// };

const QUARTER_GROUP_MONTHS = {
	jan: [0, 3, 6, 9], // Jan, Apr, Jul, Oct
	feb: [1, 4, 7, 10], // Feb, May, Aug, Nov
	mar: [2, 5, 8, 11] // Mar, Jun, Sep, Dec
};

export function generateVATReturnObligations(org: Organisation, from: Date, to: Date): Date[] {
	if (!org.vatRegistered) return [];
	if (!org.vatFrequency) return [];

	const results: Date[] = [];

	//
	// 🟩 Monthly VAT (simple)
	//
	if (org.vatFrequency === 'monthly') {
		let current = org.vatStartDate ?? from;

		while (current <= to) {
			const periodEnd = new UTCDate(
				current.getFullYear(),
				current.getMonth() + 1,
				0 // end of month
			);

			const dueDate = addDays(addMonths(periodEnd, 1), 7);

			if (dueDate >= from && dueDate <= to) {
				results.push(dueDate);
			}

			current = addMonths(current, 1);
		}

		return results;
	}

	//
	// 🟦 Quarterly VAT (HMRC stagger)
	//
	if (org.vatFrequency === 'quarterly') {
		if (!org.vatQuarterGroup) return [];

		const months = QUARTER_GROUP_MONTHS[org.vatQuarterGroup];

		let year = from.getFullYear() - 1;

		while (true) {
			for (const month of months) {
				const periodEnd = new UTCDate(year, month + 1, 0);

				const dueDate = addDays(addMonths(periodEnd, 1), 7);

				if (dueDate > to) return results;

				if (dueDate >= from) {
					// Respect VAT start date if present
					if (!org.vatStartDate || isAfter(periodEnd, org.vatStartDate)) {
						results.push(dueDate);
					}
				}
			}

			year++;
		}
	}

	//
	// 🟨 Annual VAT (optional stub)
	//
	return results;
}
