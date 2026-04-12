import type { Organisation } from '$lib/types/organisations';
import { UTCDate } from '@date-fns/utc';

export function getNextFYE(org: Organisation, today: Date): Date {
	let fye = new UTCDate(
		today.getFullYear(),
		org.financialYearEndMonth - 1,
		org.financialYearEndDay
	);

	if (org.financialYearEndIsLastDay) {
		fye = new UTCDate(today.getFullYear(), org.financialYearEndMonth, 0);
	}

	// If already passed → next year
	if (fye < today) {
		fye.setFullYear(fye.getFullYear() + 1);
	}

	return fye;
}
