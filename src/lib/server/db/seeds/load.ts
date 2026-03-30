import { db } from '../index.ts';
import * as schema from './../schema';
import {
	entityTypeUkLtd,
	eventTypeSeeds,
	jurisdictionUK,
	obligationTemplateSeeds,
	obligationTypeSeeds
} from './chronium-uk-seed';

// 1. Properly type the transaction object using Drizzle's ExtractTablesWithRelations
// Or more simply, use the generic Transaction type from your driver
type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

// @ts-ignore
async function clearData(tx: Transaction) {
	const {
		recurrenceRules,
		obligations,
		events,
		organisation,
		obligationTemplates,
		jurisdictions,
		entityTypes,
		eventTypes,
		obligationTypes
	} = schema;
	await tx.delete(recurrenceRules);
	await tx.delete(obligations);
	await tx.delete(events);
	await tx.delete(organisation);
	await tx.delete(obligationTemplates);
	await tx.delete(jurisdictions);
	await tx.delete(entityTypes);
	await tx.delete(eventTypes);
	await tx.delete(obligationTypes);
}

async function getEventTypeLookup(tx: Transaction) {
	const allEventTypes = await tx
		.select({
			id: schema.eventTypes.id,
			key: schema.eventTypes.key
		})
		.from(schema.eventTypes);

	// Convert the array into a Map for O(1) lookups
	// Map<key, id>
	const lookup = new Map<string, string>(allEventTypes.map((row) => [row.key, row.id]));

	return lookup;
}

async function getObligationTypeLookup(tx: Transaction) {
	const allObligationTypes = await tx
		.select({
			id: schema.obligationTypes.id,
			key: schema.obligationTypes.key
		})
		.from(schema.obligationTypes);

	// Convert the array into a Map for O(1) lookups
	// Map<key, id>
	const lookup = new Map<string, string>(allObligationTypes.map((row) => [row.key, row.id]));

	return lookup;
}

const load = async () => {
	try {
		console.log('⏳ Starting database seed...');

		await db.transaction(async (tx) => {
			await clearData(tx);

			await tx.insert(schema.jurisdictions).values(jurisdictionUK);
			await tx.insert(schema.entityTypes).values(entityTypeUkLtd);
			//await tx.insert(schema.organisation).values(organisationUkLtd);
			await tx.insert(schema.eventTypes).values(eventTypeSeeds);
			await tx.insert(schema.obligationTypes).values(obligationTypeSeeds);

			const eventTypeMap = await getEventTypeLookup(tx);
			const obligationTypeMap = await getObligationTypeLookup(tx);

			// Use for...of so 'await' actually works inside the loop
			for (const item of obligationTemplateSeeds) {
				const triggerId = eventTypeMap.get(item.eventTypeKey!);
				const obligationId = obligationTypeMap.get(item.obligationTypeKey);

				console.log({ eventTypeKey: item.eventTypeKey, obligationTypeKey: item.obligationTypeKey });

				// Guard: Drizzle will complain if these are undefined but marked .notNull()
				if (!triggerId) {
					throw new Error(`Missing Event Type lookup for "${item.eventTypeKey}"`);
				}

				if (!obligationId) {
					throw new Error(`Missing Obligation Type lookup for "${item.obligationTypeKey}"`);
				}

				await tx.insert(schema.obligationTemplates).values({
					name: item.name,
					obligationTypeId: obligationId,
					eventTypeId: triggerId,
					jurisdictionId: jurisdictionUK.id,
					triggerEventTypeId: entityTypeUkLtd.id,
					dueOffsetDays: item.dueOffsetDays,
					dueOffsetMonths: item.dueOffsetMonths,
					firstOccurrenceOverride: item.firstOccurrenceOverride,
					firstOccurrenceBase: item.firstOccurrenceBase,
					firstOccurrenceMonths: item.firstOccurrenceMonths,
					firstOccurrenceDays: item.firstOccurrenceDays
				});
			}

			// for (const item of defaultRecurrenceRules) {
			// 	const eventTypeId = eventTypeMap.get(item.eventTypeKey);
			// 	// Guard: Drizzle will complain if these are undefined but marked .notNull()
			// 	if (!eventTypeId) {
			// 		throw new Error(`Missing lookup for ${item.eventTypeKey}`);
			// 	}

			// 	await tx.insert(schema.recurrenceRules).values({
			// 		organisationId: organisationUkLtd.id,
			// 		eventTypeId: eventTypeId,
			// 		name: item.name,
			// 		startDate: item.startDate,
			// 		frequency: item.frequency,
			// 		interval: item.interval
			// 	});
			// }
		});

		console.log('✅ Seed completed successfully.');
		process.exit(0); // 2. Explicitly exit success
	} catch (error) {
		console.error('❌ Seed failed:', error);
		process.exit(1); // 3. Exit with error code
	}
};

load();
