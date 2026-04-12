import type { Organisation } from '$lib/types/organisations';
import { UTCDate } from '@date-fns/utc';
import { addMonths, max, subMonths } from 'date-fns';

const LOOKBACK_MONTHS = Number.parseInt(process.env.LOOKBACK_MONTHS!);
const HORIZON_MONTHS = Number.parseInt(process.env.HORIZON_MONTHS!);

export function getGenerationWindow(org: Organisation) {
	const today = new UTCDate();

	// First run (i.e. no obligationsGeneratedTo watermark)
	if (!org.obligationsGeneratedTo) {
		return {
			// No point in generating anything before the company was incorporated
			from: max([subMonths(today, LOOKBACK_MONTHS), new UTCDate(org.incorporationDate)]),
			to: addMonths(today, HORIZON_MONTHS)
		};
	}

	// Incremental run
	return {
		from: org.obligationsGeneratedTo,
		to: addMonths(today, HORIZON_MONTHS)
	};
}
