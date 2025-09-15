import { singleton, inject } from "tsyringe";
import { eq, and } from "@conduit/data";
import { User, NewUser, UserWithStats, users } from "@conduit/data";
import { IDatabaseService } from "../services/database.service.js";

export interface IUserRepository {
  findById(id: number): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  create(userData: NewUser): Promise<User>;
  update(id: number, userData: Partial<NewUser>): Promise<User | null>;
  delete(id: number): Promise<boolean>;
  findWithStats(id: number): Promise<UserWithStats | null>;
  existsByEmail(email: string): Promise<boolean>;
  existsByUsername(username: string): Promise<boolean>;
}

@singleton()
export class UserRepository implements IUserRepository {
  constructor(
    @inject("IDatabaseService") private databaseService: IDatabaseService
  ) {}

  async findById(id: number): Promise<User | null> {
    const db = this.databaseService.getDatabase();
    const result = await db.select().from(users).where(eq(users.id, id)).get();
    return result || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const db = this.databaseService.getDatabase();
    const result = await db.select().from(users).where(eq(users.email, email)).get();
    return result || null;
  }

  async findByUsername(username: string): Promise<User | null> {
    const db = this.databaseService.getDatabase();
    const result = await db.select().from(users).where(eq(users.username, username)).get();
    return result || null;
  }

  async create(userData: NewUser): Promise<User> {
    const db = this.databaseService.getDatabase();
    const result = await db.insert(users).values(userData).returning().get();
    return result;
  }

  async update(id: number, userData: Partial<NewUser>): Promise<User | null> {
    const db = this.databaseService.getDatabase();
    const result = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date().toISOString() })
      .where(eq(users.id, id))
      .returning()
      .get();
    return result || null;
  }

  async delete(id: number): Promise<boolean> {
    const db = this.databaseService.getDatabase();
    const result = await db.delete(users).where(eq(users.id, id)).returning().get();
    return !!result;
  }

  async findWithStats(id: number): Promise<UserWithStats | null> {
    const user = await this.findById(id);
    if (!user) return null;

    // For now, return the user without stats
    // TODO: Implement proper stats calculation when follow/article repositories are available
    return {
      ...user,
      followingCount: 0,
      followersCount: 0,
      articlesCount: 0
    };
  }

  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return !!user;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const user = await this.findByUsername(username);
    return !!user;
  }
}