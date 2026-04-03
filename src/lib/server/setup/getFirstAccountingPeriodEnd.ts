import type { Organisation } from '$lib/types/organisations';
import { getCustomDate } from '$lib/utils/dates';

export function getFirstAccountingPeriodEnd(org: Organisation): Date {
	const incorporationDate = new Date(org.incorporationDate);

	let end = getCustomDate(
		incorporationDate.getFullYear(),
		org.financialYearEndMonth,
		org.financialYearEndDay
	);

	// If FYE already passed → next year
	if (end <= incorporationDate) {
		end = getCustomDate(
			incorporationDate.getFullYear() + 1,
			org.financialYearEndMonth,
			org.financialYearEndDay
		);
	}

	return end;
}
