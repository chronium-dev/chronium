import type { Organisation } from '$lib/types/organisations';
import { getCustomDate } from '$lib/utils/dates';

export function getRelevantAccountingPeriodEnd(org: Organisation, now = new Date()): Date {
	const inc = new Date(org.incorporationDate);

	// 1. First possible FYE in incorporation year
	let firstEnd = getCustomDate(
		inc.getFullYear(),
		org.financialYearEndMonth,
		org.financialYearEndDay
	);

	// If that FYE is before incorporation → move to next year
	if (firstEnd <= inc) {
		firstEnd = getCustomDate(
			inc.getFullYear() + 1,
			org.financialYearEndMonth,
			org.financialYearEndDay
		);
	}

	// 2. Now roll forward yearly until we pass 'now'
	let current = firstEnd;

	while (current <= now) {
		const next = getCustomDate(
			current.getFullYear() + 1,
			org.financialYearEndMonth,
			org.financialYearEndDay
		);

		if (next > now) break;

		current = next;
	}

	return current;
}
