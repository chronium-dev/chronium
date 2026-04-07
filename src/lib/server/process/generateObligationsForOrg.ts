// generateObligations.ts

import {
	generateAnnualAccountsObligations,
	generateConfirmationStatementObligations,
	generateVATReturnObligations
} from '$lib/server/process/compliance';
import { generateCorporationTaxObligations } from '$lib/server/process/compliance/generateCorporationTaxObligations';
import { generateFromRecurrence } from '$lib/server/process/generateFromRecurrence';
import type { DefinitionSet } from '$lib/types/obligationDefinitions';
import type { Organisation } from '$lib/types/organisations';

export async function generateObligationsForOrg(
	org: Organisation,
	definitions: DefinitionSet,
	from: Date,
	to: Date
) {
	const obligations = [];

	for (const def of definitions) {
		if (def.source === 'system') {
			let dates: Date[] = [];

			switch (def.name) {
				case 'Pay Corporation Tax':
					dates = generateCorporationTaxObligations(org, from, to);
					break;
				case 'File Annual Accounts':
					dates = generateAnnualAccountsObligations(org, from, to);
					break;

				case 'File Confirmation Statement':
					dates = generateConfirmationStatementObligations(org, from, to);
					break;

				case 'Submit VAT Return':
					dates = generateVATReturnObligations(org, from, to);
					break;
			}

			for (const dueDate of dates) {
				obligations.push({
					organisationId: org.id,
					obligationDefinitionId: def.id,
					dueDate
				});
			}
		}

		if (def.source === 'user' && def.recurrenceRule) {
			const dates = generateFromRecurrence(def.recurrenceRule, from, to);

			for (const dueDate of dates) {
				obligations.push({
					organisationId: org.id,
					obligationDefinitionId: def.id,
					dueDate
				});
			}
		}
	}

	return obligations;
}
