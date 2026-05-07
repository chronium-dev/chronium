import { computeNthOccurrence } from '$lib/server/process/common/computeNthOccurrence';
import type { OrganisationObligationSetting } from '$lib/types/organisations';

export function expandRecurrenceDates(
	setting: OrganisationObligationSetting,
	from: Date,
	to: Date
): Date[] {
	const dates: Date[] = [];

	let i = 0;

	while (true) {
		const next = computeNthOccurrence(setting, i);

		if (next > to) break;

		if (next >= from) {
			dates.push(next);
		}

		i++;
	}

	return dates;
}
