import { rebuildObligations } from '$lib/server/obligations/rebuild';

await rebuildObligations();

console.log('Obligations rebuilt');
