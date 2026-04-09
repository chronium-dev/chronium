import type { Organisation } from '$lib/types/organisations';
import { UTCDate } from '@date-fns/utc';
import { addMonths, subMonths } from 'date-fns';

const LOOKBACK_MONTHS = Number.parseInt(process.env.LOOKBACK_MONTHS!);
const HORIZON_MONTHS = Number.parseInt(process.env.HORIZON_MONTHS!);

export function getGenerationWindow(org: Organisation) {
	const today = new UTCDate();

	// First run (no watermark)
	if (!org.obligationsGeneratedTo) {
		return {
			from: subMonths(today, LOOKBACK_MONTHS),
			to: addMonths(today, HORIZON_MONTHS)
		};
	}

	// Incremental run
	return {
		from: org.obligationsGeneratedTo,
		to: addMonths(today, HORIZON_MONTHS)
	};
}
