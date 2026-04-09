import type { GeneratedObligation } from '$lib/types/obligations';
import type { Organisation } from '$lib/types/organisations';
import { UTCDate } from '@date-fns/utc';
import { addDays, addMonths, isAfter } from 'date-fns';

const QUARTER_GROUP_MONTHS = {
	jan: [0, 3, 6, 9],
	feb: [1, 4, 7, 10],
	mar: [2, 5, 8, 11]
};

export function generateVATObligations(
	org: Organisation,
	from: Date,
	to: Date
): GeneratedObligation[] {
	if (!org.vatRegistered) return [];
	if (!org.vatFrequency) return [];

	const obligations: GeneratedObligation[] = [];

	//
	// 🟩 Monthly VAT
	//
	if (org.vatFrequency === 'monthly') {
		let current = org.vatStartDate ?? from;

		while (current <= to) {
			const periodEnd = new UTCDate(current.getFullYear(), current.getMonth() + 1, 0);

			const due = addDays(addMonths(periodEnd, 1), 7);

			if (due >= from && due <= to) {
				obligations.push({ key: 'vat_return', dueDate: due }, { key: 'vat_payment', dueDate: due });
			}

			current = addMonths(current, 1);
		}

		return obligations;
	}

	//
	// 🟦 Quarterly VAT (HMRC stagger)
	//
	if (org.vatFrequency === 'quarterly') {
		if (!org.vatQuarterGroup) return [];

		const months = QUARTER_GROUP_MONTHS[org.vatQuarterGroup];

		let year = from.getFullYear() - 1;

		while (true) {
			for (const month of months) {
				const periodEnd = new UTCDate(year, month + 1, 0);
				const due = addDays(addMonths(periodEnd, 1), 7);

				if (due > to) return obligations;

				if (due >= from) {
					if (!org.vatStartDate || isAfter(periodEnd, org.vatStartDate)) {
						obligations.push(
							{ key: 'vat_return', dueDate: due },
							{ key: 'vat_payment', dueDate: due }
						);
					}
				}
			}

			year++;
		}
	}

	//
	// 🟨 Annual VAT (optional)
	//
	if (org.vatFrequency === 'annual') {
		let current = org.vatStartDate ?? from;

		while (current <= to) {
			const periodEnd = addMonths(current, 12);
			const due = addDays(addMonths(periodEnd, 1), 7);

			if (due >= from && due <= to) {
				obligations.push({ key: 'vat_return', dueDate: due }, { key: 'vat_payment', dueDate: due });
			}

			current = periodEnd;
		}
	}

	return obligations;
}
