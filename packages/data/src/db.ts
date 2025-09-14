import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';

export interface DatabaseOptions {
  readonly?: boolean;
  fileMustExist?: boolean;
  timeout?: number;
  verbose?: (message?: unknown, ...additionalArgs: unknown[]) => void;
  nativeBinding?: string;
}

export interface DatabaseConfig {
  filename?: string;
  options?: DatabaseOptions;
}

export function createDatabase(config?: DatabaseConfig) {
  const filename = config?.filename || './conduit.db';
  const options = config?.options || {};

  const sqlite = new Database(filename, options);

  sqlite.pragma('journal_mode = WAL');
  sqlite.pragma('foreign_keys = ON');
  sqlite.pragma('synchronous = NORMAL');

  return drizzle(sqlite, { schema });
}

export type Database = ReturnType<typeof createDatabase>;

export { schema };