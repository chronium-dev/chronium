type VatQuarterGroup = 'mar' | 'jan' | 'feb';

export function inferVatQuarterGroup(date: Date): VatQuarterGroup {
	const month = date.getMonth() + 1; // JS months are 0-based

	if ([3, 6, 9, 12].includes(month)) return 'mar';
	if ([1, 4, 7, 10].includes(month)) return 'jan';
	if ([2, 5, 8, 11].includes(month)) return 'feb';

	throw new Error('Invalid VAT period end month');
}
