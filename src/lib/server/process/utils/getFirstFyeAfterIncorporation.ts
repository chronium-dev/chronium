import { buildFyeForYear } from '$lib/server/process/utils/buildFyeForYear';
import type { Organisation } from '$lib/types/organisations';
import { UTCDate } from '@date-fns/utc/date';

export function getFirstFyeAfterIncorporation(org: Organisation): UTCDate {
	const incorporation = new UTCDate(org.incorporationDate);

	// let fye = buildFyeForYear(org, incorporation.getFullYear());

	// if (incorporation > fye) {
	// 	fye = buildFyeForYear(org, incorporation.getFullYear() + 1);
	// }

	let fye = buildFyeForYear(org, incorporation.getFullYear() + 1);
	console.log('First Year End after Incorporation:', fye);

	return fye;
}
