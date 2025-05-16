import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';
import { files } from './schema';
// Ensure DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set.');
}

// Initialize Neon SQL client
const sql = neon(process.env.DATABASE_URL);

// Initialize Drizzle ORM with Neon SQL client and schema
export const db = drizzle(sql, { schema });

console.log('Database connection established:', db);

export { sql };
async function testConnection() {
  try {
    // Simple raw SQL query to check connection
    const result = await sql.query('SELECT NOW()');
    console.log('Current time from DB:', result);

    // Try querying the files table - fetch zero or more rows
    const fileList = await db.query.files.findMany();
    console.log('Files in DB:', fileList);
  } catch (error) {
    console.error('Error testing DB connection:', error);
  }
}

testConnection();
