import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as relations from './relations';
import * as schema from './schema';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

const client = postgres(process.env.DATABASE_URL);

const fullSchema = {
	...schema,
	...relations
};

export const db = drizzle(client, {
	schema: fullSchema,
	logger: true
});

export type DB = typeof db;
export type TX = Parameters<Parameters<typeof db.transaction>[0]>[0];

export type DBExecutor = DB | TX;

export function getExecutor(tx?: DBExecutor): DBExecutor {
	return tx ?? db;
}
