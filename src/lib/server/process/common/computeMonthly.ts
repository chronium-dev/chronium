import { RecurrenceTypeType } from '$lib/server/db/schema';
import type { OrganisationObligationSetting } from '$lib/types/organisations';
import { UTCDate } from '@date-fns/utc';
import { endOfMonth, getDaysInMonth } from 'date-fns';

export function computeMonthly(
	anchor: UTCDate,
	monthsToAdd: number,
	setting: OrganisationObligationSetting
): UTCDate {
	const year = anchor.getUTCFullYear();
	const month = anchor.getUTCMonth() + monthsToAdd;

	const targetYear = year + Math.floor(month / 12);
	const targetMonth = month % 12;

	if (setting.recurrenceType === RecurrenceTypeType.LastDayOfMonth) {
		return endOfMonth(new UTCDate(targetYear, targetMonth, 1));
	}

	if (setting.dayOfMonth) {
		const lastDay = getDaysInMonth(new UTCDate(targetYear, targetMonth, 1));
		const day = Math.min(setting.dayOfMonth, lastDay);

		return new UTCDate(targetYear, targetMonth, day);
	}

	// fallback to anchor day
	const anchorDay = anchor.getUTCDate();
	const lastDay = getDaysInMonth(new UTCDate(targetYear, targetMonth, 1));
	const day = Math.min(anchorDay, lastDay);

	return new UTCDate(targetYear, targetMonth, day);
}
