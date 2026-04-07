// compliance/vatReturns.ts

import type { Organisation } from '$lib/types/organisations';
import { addMonths, addDays } from 'date-fns';

export function generateVATReturnObligations(org: Organisation, from: Date, to: Date): Date[] {
	if (!org.vatRegistered) return [];

	const results: Date[] = [];

	let periodEnd = new Date(org.incorporationDate);

	while (periodEnd <= to) {
		const dueDate = addDays(addMonths(periodEnd, 1), 7);

		if (dueDate >= from && dueDate <= to) {
			results.push(dueDate);
		}

		periodEnd = addMonths(periodEnd, 3);
	}

	return results;
}
