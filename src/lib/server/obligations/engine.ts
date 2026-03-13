export async function runEngine() {
	const events = await loadEvents();

	for (const event of events) {
		await processEvent(event);
	}
}
