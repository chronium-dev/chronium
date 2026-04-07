// compliance/corporationTax.ts

import type { Organisation } from '$lib/types/organisations';
import { addMonths, addDays } from 'date-fns';

// type Organisation = {
// 	incorporationDate: Date;
// 	financialYearEndDay: number;
// 	financialYearEndMonth: number;
// };

export function generateCorporationTaxObligations(org: Organisation, from: Date, to: Date) {
	const results: Date[] = [];

	let year = from.getFullYear() - 1;

	while (true) {
		const fyEnd = new Date(year, org.financialYearEndMonth - 1, org.financialYearEndDay);

		const dueDate = addDays(addMonths(fyEnd, 9), 1);

		if (dueDate > to) break;

		if (dueDate >= from) {
			results.push(dueDate);
		}

		year++;
	}

	return results;
}
