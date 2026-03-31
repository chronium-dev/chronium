import { addDays, addMonths } from 'date-fns';

export function splitCorporationTaxPeriods(start: Date, end: Date): { start: Date; end: Date }[] {
	const periods = [];

	let currentStart = start;

	/**
	 * NB: “Dates are clamped to end-of-month when necessary”
	 * ... e.g. Jan 31 + 1 month → Feb 28 ✅ (good)
	 *
	 */

	while (currentStart < end) {
		let nextEnd = addDays(addMonths(currentStart, 12), -1);

		if (nextEnd >= end) {
			nextEnd = end;
		}

		periods.push({
			start: currentStart,
			end: nextEnd
		});

		currentStart = addDays(nextEnd, 1);
	}

	return periods;
}
