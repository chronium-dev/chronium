import {
	generateAccountingPeriodObligations,
	generateConfirmationStatementObligations,
	generateFinalFPSObligations,
	generatePAYEObligations,
	generateVATObligations
} from '$lib/server/process/statutory';
import type { ObligationRuntimeContext } from '$lib/types/obligations';
import type { Organisation } from '$lib/types/organisations';
import type { UTCDate } from '@date-fns/utc';

export function generateStatutoryObligationsController(
	org: Organisation,
	context: ObligationRuntimeContext,
	from: UTCDate,
	to: UTCDate
) {
	const all = [];

	if (
		context.enabledKeys.has('annual_accounts') ||
		context.enabledKeys.has('corporation_tax_payment') ||
		context.enabledKeys.has('corporation_tax_return')
	) {
		all.push(...generateAccountingPeriodObligations(org, from, to));
	}

	if (context.enabledKeys.has('confirmation_statement')) {
		all.push(...generateConfirmationStatementObligations(org, from, to));
	}

	if (context.enabledKeys.has('vat_return_and_payment')) {
		all.push(...generateVATObligations(org, from, to));
	}

	if (context.enabledKeys.has('paye_payment')) {
		all.push(...generatePAYEObligations(org, from, to));
	}

	if (context.enabledKeys.has('final_fps')) {
		all.push(...generateFinalFPSObligations(org, from, to));
	}

	return all;
}
