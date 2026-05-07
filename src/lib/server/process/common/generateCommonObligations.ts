import { expandRecurrenceDates } from '$lib/server/process/common/expandRecurrenceDates';
import type { GeneratedObligation } from '$lib/types/obligations';
import type { OrganisationObligationSetting } from '$lib/types/organisations';

export function generateCommonObligations(
	setting: OrganisationObligationSetting,
	from: Date,
	to: Date
): GeneratedObligation[] {
	if (!setting.enabled || !setting.configured || !setting.frequency || !setting.anchorDate)
		return [];

	const dates = expandRecurrenceDates(setting, from, to);

	return dates.map((date) => ({
		key: setting.key,
		dueDate: date,
		eventDate: date // or null depending on semantics
	}));
}
