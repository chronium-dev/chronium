import { db } from '../../index.ts';
import * as schema from '../../schema.ts';
import { entityTypeUkLtd, jurisdictionUK, obligationTemplatesSeeds } from './all-data.ts';

// 1. Properly type the transaction object using Drizzle's ExtractTablesWithRelations
// Or more simply, use the generic Transaction type from your driver
type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

// @ts-ignore
async function clearData(tx: Transaction) {
	const {
		organisation,
		jurisdictions,
		entityTypes,
		obligationTemplates
		// recurrenceRules,
		// obligations,
		// obligationDefinitions,
	} = schema;
	await tx.delete(obligationTemplates);
	await tx.delete(organisation);
	await tx.delete(jurisdictions);
	await tx.delete(entityTypes);
	// await tx.delete(recurrenceRules);
	// await tx.delete(obligations);
	// await tx.delete(obligationDefinitions);
}

const load = async () => {
	try {
		console.log('⏳ Starting database seed...');

		await db.transaction(async (tx) => {
			await clearData(tx);
			await tx.insert(schema.jurisdictions).values(jurisdictionUK);
			await tx.insert(schema.entityTypes).values(entityTypeUkLtd);
			await tx.insert(schema.obligationTemplates).values(obligationTemplatesSeeds);
			//await tx.insert(schema.organisation).values(organisationUkLtd);
		});

		console.log('✅ Seed completed successfully.');
		process.exit(0); // 2. Explicitly exit success
	} catch (error) {
		console.error('❌ Seed failed:', error);
		process.exit(1); // 3. Exit with error code
	}
};

load();
