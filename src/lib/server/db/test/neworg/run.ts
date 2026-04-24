import { UTCDate } from '@date-fns/utc';
import { endOfMonth } from 'date-fns';
import { isLastDayOfMonth } from 'date-fns/isLastDayOfMonth';
import { db } from '../../index.ts';
import * as schema from '../../schema.ts';
// import { entityTypeUkLtd, jurisdictionUK, obligationTemplatesSeeds } from './all-data.ts';
import {
	organisationFormSchema,
	type OrganisationFormData
} from '../../../../validations/organisation';
import { generateStatutoryObligations } from '../../../process/statutory/generateStatutoryObligations.ts';
import { createOrg } from '../../queries/org.ts';

// 1. Properly type the transaction object using Drizzle's ExtractTablesWithRelations
// Or more simply, use the generic Transaction type from your driver
type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

// @ts-ignore
async function clearData(tx: Transaction) {
	const { organisation } = schema;
	await tx.delete(organisation);
}

const organisationFormSchemaTransformed = organisationFormSchema.transform((data) => {
	const financialYearEndIsLastDay = isLastDayOfMonth(data.financialYearEnd);
	if (data.vatRegistered === 'yes' && data.vatFrequency === 'quarterly' && data.vatEndDate) {
		const vatEndDate = endOfMonth(new UTCDate(data.vatEndDate + '-01'));
		return {
			...data,
			vatEndDate: vatEndDate.toISOString(),
			financialYearEndIsLastDay
		};
	}
	return { ...data, financialYearEndIsLastDay };
});

const run = async () => {
	try {
		console.log('⏳ Starting database seed...');

		const userId = 'tl9VkoIT1sU4bxhdgYXFjFDHS5HXD1ne';

		await db.transaction(async (tx) => {
			await clearData(tx);

			const newOrg: OrganisationFormData = {
				name: 'ABC Motors Ltd',
				incorporationDate: '2016-02-12',
				financialYearEnd: '2027-02-28',
				vatRegistered: 'yes',
				vatFrequency: 'quarterly',
				vatEndDate: '2026-05',
				payrollActive: 'yes',
				payeFrequency: 'monthly',
				employeeCount: '6-20',
				businessPremises: 'no'
			};

			const result = organisationFormSchemaTransformed.parse(newOrg);

			const createResult = await createOrg(result, userId, tx);
			if (!createResult.ok) {
				console.log('Error:', createResult.message);
				throw new Error(createResult.message);
			}

			await generateStatutoryObligations(createResult.org, userId, tx);
		});

		console.log('✅ Test completed successfully.');
		process.exit(0); // 2. Explicitly exit success
	} catch (error) {
		console.error('❌ Test failed:', error);
		process.exit(1); // 3. Exit with error code
	}
};

run();
