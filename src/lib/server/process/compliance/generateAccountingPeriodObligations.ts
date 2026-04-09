import { getAccountingPeriodEnds } from '$lib/server/process/utils/getAccountingPeriodEnds';
import type { GeneratedObligation } from '$lib/types/obligations';
import type { Organisation } from '$lib/types/organisations';
import { addDays, addMonths } from 'date-fns';

export function generateAccountingPeriodObligations(
	org: Organisation,
	from: Date,
	to: Date
): GeneratedObligation[] {
	const obligations: GeneratedObligation[] = [];

	const periodEnds = getAccountingPeriodEnds(org, from, to);

	for (const periodEnd of periodEnds) {
		// 1. Annual Accounts (Companies House)
		obligations.push({
			key: 'annual_accounts',
			dueDate: addMonths(periodEnd, 9)
		});

		// 2. Corporation Tax Payment (HMRC)
		obligations.push({
			key: 'corporation_tax_payment',
			dueDate: addDays(addMonths(periodEnd, 9), 1)
		});

		// 3. Corporation Tax Return (CT600)
		obligations.push({
			key: 'corporation_tax_return',
			dueDate: addMonths(periodEnd, 12)
		});
	}

	return obligations;
}
