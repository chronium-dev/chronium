import { computeMonthly } from '$lib/server/process/common/computeMonthly';
import { computeYearly } from '$lib/server/process/common/computeYearly';
import type { OrganisationObligationSetting } from '$lib/types/organisations';
import { UTCDate } from '@date-fns/utc';

export function computeNthOccurrence(setting: OrganisationObligationSetting, n: number): UTCDate {
	const anchor = new UTCDate(setting.anchorDate!);

	switch (setting.frequency) {
		case 'monthly': {
			const monthsToAdd = n * setting.interval;
			return computeMonthly(anchor, monthsToAdd, setting);
		}

		case 'quarterly': {
			const monthsToAdd = n * setting.interval * 3;
			return computeMonthly(anchor, monthsToAdd, setting);
		}

		case 'yearly': {
			const yearsToAdd = n * setting.interval;
			return computeYearly(anchor, yearsToAdd, setting);
		}

		case 'weekly': {
			const daysToAdd = n * setting.interval * 7;
			const d = new UTCDate(anchor);
			d.setUTCDate(d.getUTCDate() + daysToAdd);
			return d;
		}

		default:
			return anchor;
	}
}
