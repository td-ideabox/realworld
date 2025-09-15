import { describe, it, expect } from 'vitest';
import "reflect-metadata";
import { container } from "../container.js";
import { IDatabaseService } from "../services/database.service.js";
import { IUserRepository } from "../repositories/user.repository.js";

describe('Singleton Behavior Test', () => {
  it('should verify singletons share the same DatabaseService', async () => {
    // Get the database service and initialize
    const databaseService1 = container.resolve<IDatabaseService>("IDatabaseService");
    await databaseService1.initialize();

    // Get it again - should be the same instance
    const databaseService2 = container.resolve<IDatabaseService>("IDatabaseService");

    // Verify they're the same instance
    expect(databaseService1).toBe(databaseService2);

    // Get a repository
    const userRepository = container.resolve<IUserRepository>("IUserRepository");

    // Access the private DatabaseService from the repository (for testing)
    const repoDbService = (userRepository as any).databaseService;

    // Verify the repository got the same DatabaseService instance
    expect(repoDbService).toBe(databaseService1);

    // Verify the repository can access the database
    expect(() => repoDbService.getDatabase()).not.toThrow();
  });
});