import { buildFyeForYear } from '$lib/server/process/utils/buildFyeForYear';
import type { Organisation } from '$lib/types/organisations';
import { UTCDate } from '@date-fns/utc/date';

export function getNextFyeFromDate(org: Organisation, date: Date): UTCDate {
	const d = new UTCDate(date);

	let fye = buildFyeForYear(org, d.getFullYear());

	if (fye < d) {
		fye = buildFyeForYear(org, d.getFullYear() + 1);
	}

	return fye;
}
