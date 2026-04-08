// compliance/annualAccounts.ts

import type { Organisation } from '$lib/types/organisations';
import { addMonths, min, isAfter } from 'date-fns';

// type Organisation = {
// 	incorporationDate: Date;
// 	financialYearEndDay: number;
// 	financialYearEndMonth: number;
// };

export function generateAnnualAccountsObligations(org: Organisation, from: Date, to: Date): Date[] {
	const results: Date[] = [];

	//
	// 1. Determine FIRST accounting period end
	//

	const firstFye = new Date(
		new Date(org.incorporationDate).getFullYear(),
		org.financialYearEndMonth - 1,
		org.financialYearEndDay
	);

	// If incorporation is AFTER FYE → move to next year
	if (firstFye <= org.incorporationDate) {
		firstFye.setFullYear(firstFye.getFullYear() + 1);
	}

	//
	// 2. Cap first period at 18 months
	//

	const maxFirstPeriodEnd = addMonths(org.incorporationDate, 18);

	const firstPeriodEnd = min([firstFye, maxFirstPeriodEnd]);

	//
	// 3. First filing deadline
	//

	const firstDueDate = addMonths(org.incorporationDate, 21);

	if (firstDueDate >= from && firstDueDate <= to) {
		results.push(firstDueDate);
	}

	//
	// 4. Subsequent periods (normal cycle)
	//

	let year = firstPeriodEnd.getFullYear();

	while (true) {
		const fyEnd = new Date(year, org.financialYearEndMonth - 1, org.financialYearEndDay);

		const dueDate = addMonths(fyEnd, 9);

		if (dueDate > to) break;

		// Avoid overlap with first filing
		if (isAfter(dueDate, firstDueDate)) {
			if (dueDate >= from) {
				results.push(dueDate);
			}
		}

		year++;
	}

	return results;
}
