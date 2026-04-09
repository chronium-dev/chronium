// lib/mappers/organisation.ts

import type { Organisation } from '$lib/types/organisations';
import type { OrganisationFormData } from '$lib/validations/organisation';
import { UTCDate } from '@date-fns/utc';

// Form → DB
export function mapOrgFormDataToDbValues(data: OrganisationFormData) {
	return {
		...data,
		financialYearEndMonth: new UTCDate(data.financialYearEnd).getMonth(),
		financialYearEndDay: new UTCDate(data.financialYearEnd).getDate(),
		vatRegistered: data.vatRegistered === 'yes',
		payrollActive: data.payrollActive === 'yes',
		businessPremises: data.businessPremises === 'yes'
	};
}

// DB → Form defaults
export function toFormDefaults(org: Organisation): Partial<OrganisationFormData> {
	const dt = new UTCDate(
		new UTCDate().getFullYear(),
		org.financialYearEndMonth,
		org.financialYearEndDay
	);

	return {
		...org,
		financialYearEnd: dt.toISOString(),
		vatRegistered: org.vatRegistered ? 'yes' : 'no',
		payrollActive: org.payrollActive ? 'yes' : 'no',
		businessPremises: org.businessPremises ? 'yes' : 'no'
	};
}
