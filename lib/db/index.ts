/**
 * Drizzle client over Neon serverless (the native Vercel Postgres successor).
 *
 * Graceful degradation: if no connection string is set the export is `null`
 * and `isDbConfigured()` is false, so the public marketing site keeps working
 * (forms still email) and the admin shows a "connect the database" notice
 * instead of crashing.
 *
 * Locally: `vercel env pull .env.local` (or set DATABASE_URL) then `pnpm db:push`.
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";

const connectionString =
  process.env.DATABASE_URL ??
  process.env.POSTGRES_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  "";

export const isDbConfigured = (): boolean => connectionString.length > 0;

export const db = connectionString
  ? drizzle(neon(connectionString), { schema })
  : null;

export { schema };
