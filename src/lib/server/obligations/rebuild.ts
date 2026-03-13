export async function rebuildObligations() {
	await db.delete(obligations);

	const events = await db.select().from(events);

	for (const event of events) {
		await processEvent(event);
	}
}
