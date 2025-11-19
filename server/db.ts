import pkg from 'pg';
const { Pool } = pkg;
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create connection pool with better error handling
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  // Add connection error handling
  connectionTimeoutMillis: 10000,
  // Force IPv4 if available
  keepAlive: true,
});

// Handle connection errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const db = drizzle(pool, { schema });
