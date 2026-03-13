import { db } from '$lib/server/db';
import { events } from '$lib/server/db/schema';
import { processEvent } from '$lib/server/obligations/processEvent';

export async function createEvent(data) {
	const [event] = await db.insert(events).values(data).returning();

	await processEvent(event);

	return event;
}
