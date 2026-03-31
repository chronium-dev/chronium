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

import { PgDatabase, PgTransaction } from 'drizzle-orm/pg-core';
import { type PostgresJsQueryResultHKT } from 'drizzle-orm/postgres-js'; // Or your specific driver like node-postgres

// 1. Create a type that represents your specific schema
export type Schema = typeof schema;

// This union type allows for both the DB and the Transaction
export type DBClient =
	| PgDatabase<PostgresJsQueryResultHKT, Schema>
	| PgTransaction<PostgresJsQueryResultHKT, Schema, any>;
