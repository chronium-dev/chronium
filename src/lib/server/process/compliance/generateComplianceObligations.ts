import {
	generateAccountingPeriodObligations,
	generateConfirmationStatementObligations,
	generateVATObligations
} from '$lib/server/process/compliance';
import type { ObligationRuntimeContext } from '$lib/types/obligations';
import type { Organisation } from '$lib/types/organisations';
import type { UTCDate } from '@date-fns/utc';

export function generateComplianceObligations(
	org: Organisation,
	context: ObligationRuntimeContext,
	from: UTCDate,
	to: UTCDate
) {
	// const all = [
	// 	...generateAccountingPeriodObligations(org, from, to),
	// 	...generateConfirmationStatementObligations(org, from, to),
	// 	...generateVATObligations(org, from, to)
	// ];

	// // 🔥 Filter by enabled keys
	// return all.filter((o) => context.enabledKeys.has(o.key));

	const all = [];

	if (
		context.enabledKeys.has('annual_accounts') ||
		context.enabledKeys.has('corporation_tax_payment') ||
		context.enabledKeys.has('corporation_tax_return')
	) {
		all.push(...generateAccountingPeriodObligations(org, from, to));
	}

	// if (context.enabledKeys.has('confirmation_statement')) {
	// 	all.push(...generateConfirmationStatementObligations(org, from, to));
	// }

	// if (context.enabledKeys.has('vat_return') || context.enabledKeys.has('vat_payment')) {
	// 	all.push(...generateVATObligations(org, from, to));
	// }

	return all;
}
