import type { Organisation } from '$lib/types/organisations';
import { addDays } from 'date-fns';

export function getGenerationWindow(org: Organisation) {
	const today = new UTCDate();

	const from = org.obligationGenerationHorizon ?? today;

	// TODO - this 90 days period should not be hard-coded. And should we use months instead??
	const to = addDays(today, 90);

	return { from, to };
}
