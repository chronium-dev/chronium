import { addMonths, addDays } from 'date-fns';

export function splitCorporationTaxPeriods(start: Date, end: Date): { start: Date; end: Date }[] {
	const periods = [];

	let currentStart = start;

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
