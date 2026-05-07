import type { OrganisationObligationSetting } from '$lib/types/organisations';
import { UTCDate } from '@date-fns/utc';
import { getDaysInMonth } from 'date-fns';

export function computeYearly(
	anchor: UTCDate,
	yearsToAdd: number,
	setting: OrganisationObligationSetting
): UTCDate {
	const year = anchor.getUTCFullYear() + yearsToAdd;

	if (setting.monthOfYear && setting.dayOfMonth) {
		const month = setting.monthOfYear - 1;

		const lastDay = getDaysInMonth(new UTCDate(year, month, 1));
		const day = Math.min(setting.dayOfMonth, lastDay);

		return new UTCDate(year, month, day);
	}

	return new UTCDate(year, anchor.getUTCMonth(), anchor.getUTCDate());
}
