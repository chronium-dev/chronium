// src/lib/server/valkey.ts
import Redis from 'ioredis';
import { VALKEY_URL } from '$env/static/private';

// Initialize the client
// Valkey works seamlessly with the standard redis:// or rediss:// protocol
export const valkey = new Redis(VALKEY_URL, {
	// SaaS best practice: Explicitly handle reconnection
	retryStrategy(times) {
		const delay = Math.min(times * 50, 2000);
		return delay;
	},
	// Ensure the connection doesn't hang during dev HMR
	maxRetriesPerRequest: null
});

valkey.on('error', (err) => console.error('Valkey Client Error', err));
valkey.on('connect', () => console.log('Successfully connected to Valkey'));
