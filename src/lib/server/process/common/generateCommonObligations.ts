import type { GeneratedObligation } from '$lib/types/obligations';
import type { OrganisationObligationSetting } from '$lib/types/organisations';
import { UTCDate } from '@date-fns/utc';
import { addMonths, addYears } from 'date-fns';

export function generateCommonObligations(
	setting: OrganisationObligationSetting,
	from: Date,
	to: Date
): GeneratedObligation[] {
	if (!setting.enabled) return [];
	if (!setting.configured) return [];
	if (!setting.frequency) return [];
	if (!setting.anchorDate) return [];

	const obligations: GeneratedObligation[] = [];

	let cursor = new UTCDate(setting.anchorDate);

	while (cursor <= to) {
		if (cursor >= from) {
			obligations.push({
				key: setting.key,
				dueDate: new Date(cursor)
			});
		}

		switch (setting.frequency) {
			case 'monthly':
				cursor = addMonths(cursor, setting.interval);
				break;

			case 'quarterly':
				cursor = addMonths(cursor, 3 * setting.interval);
				break;

			case 'yearly':
				cursor = addYears(cursor, setting.interval);
				break;

			case 'weekly':
				cursor = new UTCDate(cursor);
				cursor.setDate(cursor.getDate() + 7 * setting.interval);
				break;

			default:
				return obligations;
		}
	}

	return obligations;
}
