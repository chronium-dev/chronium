// TODO: Props (what your load function should return)
export type SummaryData = {
	totalObligations: number;
	nextObligation?: {
		name: string;
		date: string; // ISO
	};
	upcoming: {
		name: string;
		date: string;
	}[];
	categories: string[]; // e.g. ['VAT', 'Accounts']
};

// export const load = (async () => {
// 	return {};
// }) satisfies PageServerLoad;

export const load = async ({ locals }) => {
	const orgId = locals.org.id;

	// pseudo code — adapt to your schema
	const obligations = await getUpcomingObligations(orgId);

	const next = obligations[0];

	return {
		data: {
			totalObligations: obligations.length,
			nextObligation: next
				? {
						name: next.name,
						date: next.dueDate
					}
				: undefined,
			upcoming: obligations.slice(0, 10).map((o) => ({
				name: o.name,
				date: o.dueDate
			})),
			categories: ['VAT', 'Accounts', 'Confirmation Statement'] // derive later
		}
	};
};
