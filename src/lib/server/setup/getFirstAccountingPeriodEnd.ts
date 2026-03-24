import type { Organisation } from '$lib/types/organisations';

export function getFirstAccountingPeriodEnd(org: Organisation): Date {
	const inc = new Date(org.incorporationDate);

	let end = new Date(inc.getFullYear(), org.financialYearEndMonth - 1, org.financialYearEndDay);

	// If FYE already passed → next year
	if (end <= inc) {
		end = new Date(inc.getFullYear() + 1, org.financialYearEndMonth - 1, org.financialYearEndDay);
	}

	return end;
}
