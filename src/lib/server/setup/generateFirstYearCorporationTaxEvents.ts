import { db } from '$lib/server/db';
import { events, eventTypes } from '$lib/server/db/schema';
import { getFirstAccountingPeriodEnd } from '$lib/server/setup/getFirstAccountingPeriodEnd';
import { splitCorporationTaxPeriods } from '$lib/server/setup/splitCorporationTaxPeriods';
import type { Organisation } from '$lib/types/organisations';
import { eq } from 'drizzle-orm';

export async function generateFirstYearCorporationTaxEvents(org: Organisation) {
	const ctEventType = await db.query.eventTypes.findFirst({
		where: eq(eventTypes.key, 'corporation_tax_period_end')
	});

	if (!ctEventType) throw new Error('Missing CT event type (corporation_tax_period_end)');

	const start = new Date(org.incorporationDate);
	const end = getFirstAccountingPeriodEnd(org);

	const periods = splitCorporationTaxPeriods(start, end);

	for (const period of periods) {
		await db
			.insert(events)
			.values({
				organisationId: org.id,
				eventTypeId: ctEventType.id,
				eventDate: period.end,
				anchorDate: period.start // 👈 IMPORTANT
				//generated: true
			})
			.onConflictDoNothing();
	}
}
