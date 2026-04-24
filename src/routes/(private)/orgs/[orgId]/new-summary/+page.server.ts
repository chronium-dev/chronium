
// TODO: Props (what the load function should return)
// export type SummaryData = {
// 	totalObligations: number;
// 	nextObligation?: {
// 		name: string;
// 		date: string; // ISO
// 	};
// 	upcoming: {
// 		name: string;
// 		date: string;
// 	}[];
// 	categories: string[]; // e.g. ['VAT', 'Accounts']
// };

import { getObligationsList } from '$lib/server/db/queries/obligations';

export const load = async ({ locals, params }) => {
	const orgId = params.orgId;
	const org = locals.requireActiveOrg();
	const horizonMonths = Number.parseInt(process.env.HORIZON_MONTHS!);

	const obligations = await getObligationsList(orgId);

	//const next = obligations[0];

	// return {
	// 	data: {
	// 		totalObligations: obligations.length,
	// 		nextObligation: next
	// 			? {
	// 					name: next.name,
	// 					date: next.dueDate
	// 				}
	// 			: undefined,
	// 		upcoming: obligations.slice(0, 10).map((o) => ({
	// 			name: o.name,
	// 			date: o.dueDate
	// 		})),
	// 		categories: ['VAT', 'Accounts', 'Confirmation Statement'] // derive later
	// 	}
	// };

	return {obligations, org, horizonMonths};
};
