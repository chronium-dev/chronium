import { getAccountingPeriodEnds } from '$lib/server/process/utils/getAccountingPeriodEnds';
import { getFirstFyeAfterIncorporation } from '$lib/server/process/utils/getFirstFyeAfterIncorporation';
import type { GeneratedObligation } from '$lib/types/obligations';
import type { Organisation } from '$lib/types/organisations';
import { UTCDate } from '@date-fns/utc';
import { addDays, addMonths, addYears, endOfMonth, subDays, subMonths } from 'date-fns';

export function generateAccountingPeriodObligations(
	org: Organisation,
	from: Date,
	to: Date
): GeneratedObligation[] {
	const obligations: GeneratedObligation[] = [];

	const safeFrom = subMonths(from, 12);
	const periodEnds = getAccountingPeriodEnds(org, safeFrom, to);

	const incorporation = new UTCDate(org.incorporationDate);

	let firstFye = getFirstFyeAfterIncorporation(org);

	for (const periodEnd of periodEnds) {
		const isFirstPeriod = periodEnd.getTime() === firstFye.getTime();

		// 🟦 Annual Accounts
		const accountsDue = isFirstPeriod
			? addMonths(incorporation, 21)
			: endOfMonth(addMonths(periodEnd, 9));

		if (accountsDue >= from && accountsDue <= to) {
			obligations.push({
				key: 'annual_accounts',
				dueDate: accountsDue,
				eventDate: periodEnd,
			});
		}

		// 🟩 Corporation Tax Payment
		const ctPaymentDue = addDays(endOfMonth(addMonths(periodEnd, 9)), 1);

		if (ctPaymentDue >= from && ctPaymentDue <= to) {
			obligations.push({
				key: 'corporation_tax_payment',
				dueDate: ctPaymentDue,
				eventDate: periodEnd
			});
		}

		// 🟨 CT600
		const ctReturnDue = isFirstPeriod
			? subDays(addMonths(addYears(incorporation, 1), 12), 1)
			: addMonths(periodEnd, 12);

		if (ctReturnDue >= from && ctReturnDue <= to) {
			obligations.push({
				key: 'corporation_tax_return',
				dueDate: ctReturnDue,
				eventDate: periodEnd
			});
		}
	}

	return obligations;
}
