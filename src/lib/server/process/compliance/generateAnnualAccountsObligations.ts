// compliance/annualAccounts.ts

import type { Organisation } from '$lib/types/organisations';
import { addMonths, isAfter } from 'date-fns';

// type Organisation = {
// 	incorporationDate: Date;
// 	financialYearEndDay: number;
// 	financialYearEndMonth: number;
// };

export function generateAnnualAccountsObligations(org: Organisation, from: Date, to: Date): Date[] {
	const results: Date[] = [];

	//
	// 1. First Accounts
	//
	const firstDueDate = addMonths(org.incorporationDate, 21);

	if (firstDueDate >= from && firstDueDate <= to) {
		results.push(firstDueDate);
	}

	//
	// 2. Subsequent Years
	//
	let year = new Date(org.incorporationDate).getFullYear();

	while (true) {
		const fyEnd = new Date(year, org.financialYearEndMonth - 1, org.financialYearEndDay);

		const dueDate = addMonths(fyEnd, 9);

		if (dueDate > to) break;

		// Avoid duplicating first period
		if (isAfter(dueDate, firstDueDate)) {
			if (dueDate >= from) {
				results.push(dueDate);
			}
		}

		year++;
	}

	return results;
}
