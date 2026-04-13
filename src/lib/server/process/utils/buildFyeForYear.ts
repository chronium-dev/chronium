import type { Organisation } from '$lib/types/organisations';
import { UTCDate } from '@date-fns/utc/date';

export function buildFyeForYear(org: Organisation, year: number): UTCDate {
	if (org.financialYearEndIsLastDay) {
		return new UTCDate(year, org.financialYearEndMonth, 0);
	}

	return new UTCDate(year, org.financialYearEndMonth - 1, org.financialYearEndDay);
}
