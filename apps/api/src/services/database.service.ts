import { injectable, singleton } from "tsyringe";
import { createDatabase, Database, DatabaseConfig, initializeSchema } from "@conduit/data";

export interface IDatabaseService {
  getDatabase(): Database;
  initialize(): Promise<void>;
  reset(): Promise<void>;
  close(): void;
}

@singleton()
export class DatabaseService implements IDatabaseService {
  private database: Database | null = null;
  private config: DatabaseConfig;

  constructor() {
    this.config = {
      filename: ':memory:',
      options: {
        verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
      }
    };
  }

  async initialize(): Promise<void> {
    if (this.database) {
      return;
    }

    this.database = createDatabase(this.config);

    // Create schema from our TypeScript definitions (via generated SQL)
    initializeSchema(this.database);

    console.log('In-memory database initialized with schema from TypeScript definitions');
  }

  async reset(): Promise<void> {
    // Close current database and create a fresh one
    this.database = null;
    await this.initialize();
  }

  getDatabase(): Database {
    if (!this.database) {
      throw new Error("Database not initialized. Call initialize() first.");
    }
    return this.database;
  }

  close(): void {
    // Better-sqlite3 databases are closed automatically when the process exits
    // But we can explicitly close if needed
    this.database = null;
  }
}