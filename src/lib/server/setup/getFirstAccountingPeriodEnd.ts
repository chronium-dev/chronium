import type { Organisation } from '$lib/types/organisations';
import { getCustomDate } from '$lib/utils/dates';

export function getFirstAccountingPeriodEnd(org: Organisation): Date {
	const inc = new Date(org.incorporationDate);

	let end = getCustomDate(
		inc.getFullYear(),
		org.financialYearEndMonth - 1,
		org.financialYearEndDay
	);

	// If FYE already passed → next year
	if (end <= inc) {
		end = getCustomDate(
			inc.getFullYear() + 1,
			org.financialYearEndMonth - 1,
			org.financialYearEndDay
		);
	}

	return end;
}
