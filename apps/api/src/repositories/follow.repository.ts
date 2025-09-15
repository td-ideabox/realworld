import { singleton, inject } from "tsyringe";
import { eq, and } from "@conduit/data";
import { Follow, NewFollow, follows, users } from "@conduit/data";
import { IDatabaseService } from "../services/database.service.js";

export interface IFollowRepository {
  findById(id: number): Promise<Follow | null>;
  findByFollowerAndFollowing(followerId: number, followingId: number): Promise<Follow | null>;
  findFollowersByUserId(userId: number): Promise<Follow[]>;
  findFollowingByUserId(userId: number): Promise<Follow[]>;
  create(followData: NewFollow): Promise<Follow>;
  delete(id: number): Promise<boolean>;
  deleteByFollowerAndFollowing(followerId: number, followingId: number): Promise<boolean>;
  isFollowing(followerId: number, followingId: number): Promise<boolean>;
  getFollowersCount(userId: number): Promise<number>;
  getFollowingCount(userId: number): Promise<number>;
}

@singleton()
export class FollowRepository implements IFollowRepository {
  constructor(
    @inject("IDatabaseService") private databaseService: IDatabaseService
  ) {}

  async findById(id: number): Promise<Follow | null> {
    const db = this.databaseService.getDatabase();
    const result = await db.select().from(follows).where(eq(follows.id, id)).get();
    return result || null;
  }

  async findByFollowerAndFollowing(followerId: number, followingId: number): Promise<Follow | null> {
    const db = this.databaseService.getDatabase();
    const result = await db
      .select()
      .from(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)))
      .get();
    return result || null;
  }

  async findFollowersByUserId(userId: number): Promise<Follow[]> {
    const db = this.databaseService.getDatabase();
    const results = await db.select().from(follows).where(eq(follows.followingId, userId)).all();
    return results;
  }

  async findFollowingByUserId(userId: number): Promise<Follow[]> {
    const db = this.databaseService.getDatabase();
    const results = await db.select().from(follows).where(eq(follows.followerId, userId)).all();
    return results;
  }

  async create(followData: NewFollow): Promise<Follow> {
    const db = this.databaseService.getDatabase();
    const result = await db.insert(follows).values(followData).returning().get();
    return result;
  }

  async delete(id: number): Promise<boolean> {
    const db = this.databaseService.getDatabase();
    const result = await db.delete(follows).where(eq(follows.id, id)).returning().get();
    return !!result;
  }

  async deleteByFollowerAndFollowing(followerId: number, followingId: number): Promise<boolean> {
    const db = this.databaseService.getDatabase();
    const result = await db
      .delete(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, followingId)))
      .returning()
      .get();
    return !!result;
  }

  async isFollowing(followerId: number, followingId: number): Promise<boolean> {
    const follow = await this.findByFollowerAndFollowing(followerId, followingId);
    return !!follow;
  }

  async getFollowersCount(userId: number): Promise<number> {
    const followers = await this.findFollowersByUserId(userId);
    return followers.length;
  }

  async getFollowingCount(userId: number): Promise<number> {
    const following = await this.findFollowingByUserId(userId);
    return following.length;
  }
}